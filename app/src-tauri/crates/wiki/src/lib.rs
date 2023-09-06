// purpose of this crate is to parse markdown content into a Topic structure
// assumed structure of most files is:
// optional front matter
// # Heading
// markdown
// ## Optional heading
// more markdown with optional headings
// ## Notes (optional)
// ## Links (optional)

// everything before either ## Notes or ## Links is content
// everything inside ## Notes heading is notes
// everything inside ## Links heading is links
// check test cases for various examples

// note: there is a working parser code in TS with mdast here:
// https://github.com/learn-anything/electron-version/blob/main/lib/wiki/wiki.ts#L76
// but it has rather bad code + is in TS
// also has tests for it here: https://github.com/learn-anything/electron-version/blob/main/test/wiki.test.ts#L8

#![allow(unused_imports)]
#![allow(dead_code)]
#![allow(unused_variables)]

#[macro_use]
extern crate log_macro;

use anyhow::Result;
use markdown::{mdast::Node, to_mdast, ParseOptions};
use std::{collections::VecDeque, net::SocketAddr};

mod test;
mod wiki;

#[derive(Debug, PartialEq)]
pub struct TopicStruct {
    public: Option<bool>, // extracted from front matter (i.e. public: true/false) if found
    title: String, // extracted from front matter (i.e. title: Solid) or first heading (if no title: in front matter)
    content: String, // everything before ## Notes or ## Links (excluding front matter)
    notes: Option<Vec<Note>>, // everything inside ## Notes heading
    links: Option<Vec<Link>>, // everything inside ## Links heading
}

// check `test_front_matter_heading_content_notes_links()` test for example of various notes
#[derive(Debug, Clone, PartialEq)]
pub struct Note {
    note: String,
    subnotes: Vec<String>,
    url: Option<String>,
    public: bool,
}

// by default parsed Note is public
impl Default for Note {
    fn default() -> Self {
        Note {
            note: String::new(),
            subnotes: Vec::new(),
            url: None,
            public: true,
        }
    }
}

// check `test_front_matter_heading_content_notes_links()` test for example of various links
#[derive(Debug, Clone, PartialEq)]
pub struct Link {
    title: String,
    url: String,
    description: Option<String>,
    related_links: Vec<RelatedLink>,
    public: bool,
}

// by default parsed Link is public
impl Default for Link {
    fn default() -> Self {
        Link {
            title: String::new(),
            url: String::new(),
            public: true,
            description: None,
            related_links: Vec::new(),
        }
    }
}

// example:
// - [Hope UI](https://github.com/fabien-ml/hope-ui) - SolidJS component library you've hoped for. ([Docs](https://hope-ui.com/docs/getting-started))
// related link in above `Link` will be title: `Docs`, url: `https://hope-ui.com/docs/getting-started`
#[derive(Debug, Clone, PartialEq)]
pub struct RelatedLink {
    title: String,
    url: String,
}

// TODO: is this actually needed?
pub struct ParsedMarkdown {
    topic: TopicStruct,
    notes: Vec<Note>,
    links: Vec<Link>,
}

// example:
// ---
// title: Solid
// ---
// markdown..
// will return `Solid` as title
fn extract_title_from_front_matter(markdown: &str) -> Option<String> {
    let re = regex::Regex::new(r"---\ntitle: (.*?)\n---").unwrap();
    re.captures(markdown)
        .and_then(|cap| cap.get(1))
        .map(|m| m.as_str().to_string())
}

// Parse markdown file, extract topic
// each topic must have title, content
// it can have notes, links
// public: true/false is extracted from front matter (by default it's true)
pub fn parse_md_content_as_topic<'a>(markdown_string: &'a str) -> Result<TopicStruct> {
    let options = ParseOptions::default();
    let ast = to_mdast(markdown_string, &options).map_err(anyhow::Error::msg)?;

    let mut nodes = VecDeque::new();
    nodes.push_back(ast);

    // try get title from front matter
    // TODO: should go into match and be done there?
    let mut title = extract_title_from_front_matter(markdown_string);

    let mut content = String::new();
    let mut notes = Vec::new();
    let mut links = Vec::new();

    // set to true once ## Notes is found
    let mut collecting_notes = false;
    // set to true once ## Links is found
    let mut collecting_links = false;

    // set to true before hitting ## Notes or ## Links
    let mut collecting_content = true;

    // TODO: GPT-4 generated, think its for this case of subnotes:
    // - Solid will never "re-render" your component/function.
    //     - Means you don't ever have to optimise re-renders.
    let mut current_note: Option<Note> = None;

    while let Some(node) = nodes.pop_front() {
        match &node {
            Node::Heading(heading) => {
                if title.is_none() {
                    title = Some(
                        heading
                            .children
                            .iter()
                            .filter_map(|child| {
                                if let Node::Text(text) = child {
                                    Some(text.value.clone())
                                } else {
                                    None
                                }
                            })
                            .collect::<Vec<String>>()
                            .join(" "),
                    );
                }

                if let Some(Node::Text(text)) = heading.children.first() {
                    match text.value.as_str() {
                        "Notes" => {
                            collecting_content = false;
                            collecting_notes = true;
                            collecting_links = false;
                        }
                        "Links" => {
                            collecting_content = false;
                            collecting_notes = false;
                            collecting_links = true;
                        }
                        _ => {}
                    }
                }
            }
            Node::List(list) => {
                for item in &list.children {
                    if collecting_notes {
                        if let Some(Node::Paragraph(para)) = item
                            .children()
                            .ok_or(anyhow::Error::msg("Failed to get children"))?
                            .first()
                        {
                            if let Node::Text(text) = &para.children[0] {
                                current_note = Some(Note {
                                    note: text.value.clone(),
                                    subnotes: Vec::new(),
                                    url: None,
                                    public: true,
                                });
                            }
                        }

                        if let Some(Node::List(sublist)) = item
                            .children()
                            .ok_or(anyhow::Error::msg("Failed to get children"))?
                            .get(1)
                        {
                            for subitem in &sublist.children {
                                if let Some(Node::Paragraph(para)) = subitem
                                    .children()
                                    .ok_or(anyhow::Error::msg("Failed to get children"))?
                                    .first()
                                {
                                    if let Node::Text(text) = &para.children[0] {
                                        current_note
                                            .as_mut()
                                            .unwrap()
                                            .subnotes
                                            .push(text.value.clone());
                                    }
                                }
                            }
                        }

                        if let Some(note) = current_note.take() {
                            notes.push(note);
                        }
                    } else if collecting_links {
                    }
                }
            }
            Node::Code(code) => {
                if collecting_content {
                    content.push_str(&code.value);
                    content.push_str("\n\n"); // Add two newlines for Markdown
                }
            }
            Node::Paragraph(para) => {
                if collecting_content {
                    let mut para_content = String::new();
                    for child in &para.children {
                        match child {
                            Node::Text(text) => {
                                para_content.push_str(&text.value);
                            }
                            Node::Link(link) => {
                                let link_text = link
                                    .children
                                    .iter()
                                    .filter_map(|child| {
                                        if let Node::Text(text) = child {
                                            Some(text.value.clone())
                                        } else {
                                            None
                                        }
                                    })
                                    .collect::<Vec<String>>()
                                    .join("");
                                para_content.push_str(&format!("[{}]({})", link_text, link.url));
                            }
                            _ => {}
                        }
                    }
                    content.push_str(&para_content);
                    content.push_str("\n\n"); // Add two newlines for Markdown paragraph
                }
            }
            _ => {} // This will catch all other variants of the Node enum
        }

        if let Some(children) = node.children() {
            for child in children.iter().cloned() {
                nodes.push_back(child);
            }
        }
    }

    let title_str = title.ok_or_else(|| anyhow::Error::msg("Failed to extract title"))?;
    Ok(TopicStruct {
        title: title_str,
        content: content.trim().to_string(),
        notes: if notes.is_empty() { None } else { Some(notes) },
        links: if links.is_empty() { None } else { Some(links) },
        public: None,
    })
}

#[cfg(test)]
mod tests {
    use crate::{
        test::get_test_folder_path,
        wiki::{get_content_of_file, get_md_files},
    };

    use super::*;

    #[test]
    fn test_no_front_matter_heading_content() {
        let markdown_string = r#"
# Hardware

[Digital Design and Computer Architecture course](https://safari.ethz.ch/digitaltechnik/spring2021/doku.php?id=start), [From Nand to Tetris](https://github.com/ghaiklor/nand-2-tetris) are great.
"#;

        let topic = parse_md_content_as_topic(&markdown_string).unwrap();
        log!(topic);

        assert_eq!(
            topic,
            TopicStruct {
                title: "Hardware".to_string(),
                content: "[Digital Design and Computer Architecture course](https://safari.ethz.ch/digitaltechnik/spring2021/doku.php?id=start), [From Nand to Tetris](https://github.com/ghaiklor/nand-2-tetris) are great.".to_string(),
                notes: None,
                links: None,
                public: None
            }
        );
    }

    #[test]
    fn test_front_matter_heading_content_notes_links() {
        let markdown_string = r#"
---
title: SolidJS
---

# [SolidJS](https://www.solidjs.com/)

Love Solid. Has [best parts](https://www.youtube.com/watch?v=qB5jK-KeXOs) of [React](react.md).

[Fine grained reactivity](https://dev.to/ryansolid/a-hands-on-introduction-to-fine-grained-reactivity-3ndf) is nice.

## OSS apps

- [CodeImage](https://github.com/riccardoperra/codeimage)
- [Solid Hacker News](https://github.com/solidjs/solid-hackernews)

## Notes

- [Solid will never "re-render" your component/function.](https://twitter.com/Axibord1/status/1606106151539687425)
    - Means you don't ever have to optimise re-renders.
    - And don't have to fight with React useEffect.
- [Solid Dev Tools](https://github.com/thetarnav/solid-devtools) are great.
- createResource makes a signal out of a promise.
- Builin components like [For](https://www.solidjs.com/docs/latest/api#for) and [Show](https://www.solidjs.com/docs/latest/api#show) are great.
- [Biggest difference between React and Solid is that things that can change are wrapped in signals in Solid, and in dependencies arrays in React.](https://twitter.com/fabiospampinato/status/1528537000504184834)

## Links

- [Hope UI](https://github.com/fabien-ml/hope-ui) - SolidJS component library you've hoped for. ([Docs](https://hope-ui.com/docs/getting-started))
- [SolidJS Docs](https://docs.solidjs.com/)
"#;

        let topic = parse_md_content_as_topic(&markdown_string).unwrap();
        log!(topic);

        let notes = vec![
            Note {
                note: "[Solid will never \"re-render\" your component/function.](https://twitter.com/Axibord1/status/1606106151539687425)".to_string(),
                subnotes: vec![
                    "Means you don't ever have to optimise re-renders.".to_string(),
                    "And don't have to fight with React useEffect.".to_string()
                ],
                url: Some("https://twitter.com/Axibord1/status/1606106151539687425".to_string()),
                public: true
            },
            Note {
                note: "[Solid Dev Tools](https://github.com/thetarnav/solid-devtools) are great.".to_string(),
                subnotes: vec![],
                url: Some("https://github.com/thetarnav/solid-devtools".to_string()),
                public: true
            },
            Note {
                note: "createResource makes a signal out of a promise.".to_string(),
                subnotes: vec![],
                url: None,
                public: true
            },
            Note {
                // all notes are rendered as markdown
                note: "Builin components like [For](https://www.solidjs.com/docs/latest/api#for) and [Show](https://www.solidjs.com/docs/latest/api#show) are great.".to_string(),
                subnotes: vec![],
                url: None,
                public: true
            },
            Note {
                note: "[Biggest difference between React and Solid is that things that can change are wrapped in signals in Solid, and in dependencies arrays in React.](https://twitter.com/fabiospampinato/status/1528537000504184834)".to_string(),
                subnotes: vec![],
                url: Some("https://twitter.com/fabiospampinato/status/1528537000504184834".to_string()),
                public: true
            },
        ];

        let links = vec![
            Link {
                title: "Hope UI".to_string(),
                url: "https://github.com/fabien-ml/hope-ui".to_string(),
                public: true,
                description: Some("SolidJS component library you've hoped for.".to_string()),
                related_links: vec![],
            },
            Link {
                title: "SolidJS Docs".to_string(),
                url: "https://docs.solidjs.com/".to_string(),
                public: true,
                description: None,
                related_links: vec![],
            },
        ];

        let topic_content = r#"
# [SolidJS](https://www.solidjs.com/)

Love Solid. Has [best parts](https://www.youtube.com/watch?v=qB5jK-KeXOs) of [React](react.md).

[Fine grained reactivity](https://dev.to/ryansolid/a-hands-on-introduction-to-fine-grained-reactivity-3ndf) is nice.

## OSS apps

- [CodeImage](https://github.com/riccardoperra/codeimage)
- [Solid Hacker News](https://github.com/solidjs/solid-hackernews)
"#;

        assert_eq!(
            topic,
            TopicStruct {
                title: "SolidJS".to_string(),
                content: topic_content.to_string(),
                notes: Some(notes),
                links: Some(links),
                public: None
            }
        );
    }
}
