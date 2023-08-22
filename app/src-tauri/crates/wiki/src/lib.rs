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
    title: String,
    content: String,
    notes: Option<Vec<Note>>,
    links: Option<Vec<Link>>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct Note {
    note: String,
    subnotes: Vec<String>,
    url: Option<String>,
    public: Option<bool>, // TODO: should be not optional, temp for testing
}

#[derive(Debug, Clone, PartialEq)]
pub struct Link {
    title: String,
    url: String,
    public: Option<bool>, // TODO: should be not optional, temp for testing
    description: Option<String>,
    related_links: Vec<RelatedLink>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct RelatedLink {
    title: String,
    url: String,
}

pub struct ParsedMarkdown {
    topic: TopicStruct,
    notes: Vec<Note>,
    links: Vec<Link>,
}

// Helper function to extract title from front matter
fn extract_title_from_front_matter(markdown: &str) -> Option<String> {
    let re = regex::Regex::new(r"---\ntitle: (.*?)\n---").unwrap();
    re.captures(markdown)
        .and_then(|cap| cap.get(1))
        .map(|m| m.as_str().to_string())
}

// parse markdown file, extract topic
pub fn parse_md_content_as_topic<'a>(markdown_string: &'a str) -> Result<TopicStruct> {
    let options = ParseOptions::default();
    let ast = to_mdast(markdown_string, &options).map_err(anyhow::Error::msg)?;
    log!(ast);

    let mut nodes = VecDeque::new();
    nodes.push_back(ast);

    let mut title = extract_title_from_front_matter(markdown_string);
    let mut content = String::new();
    let mut notes = Vec::new();
    let links = Vec::new();

    let mut collecting_notes = false;
    let mut collecting_links = false;
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
                            // collecting_content = false;
                            collecting_notes = true;
                            collecting_links = false;
                        }
                        "Links" => {
                            // collecting_content = false;
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
                                    public: None,
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
                content.push_str(&code.value);
                content.push_str("\n\n"); // Add two newlines for Markdown
            }
            Node::Paragraph(para) => {
                if let Some(Node::Text(text)) = para.children.first() {
                    content.push_str(&text.value);
                    content.push_str("\n\n"); // Add two newlines for Markdown paragraphs
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
                links: None
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
                public: None
            },
            Note {
                note: "[Solid Dev Tools](https://github.com/thetarnav/solid-devtools) are great.".to_string(),
                subnotes: vec![],
                url: Some("https://github.com/thetarnav/solid-devtools".to_string()),
                public: None
            },
            Note {
                note: "createResource makes a signal out of a promise.".to_string(),
                subnotes: vec![],
                url: None,
                public: None
            },
            Note {
                // all notes are rendered as markdown
                note: "Builin components like [For](https://www.solidjs.com/docs/latest/api#for) and [Show](https://www.solidjs.com/docs/latest/api#show) are great.".to_string(),
                subnotes: vec![],
                url: None,
                public: None
            },
            Note {
                note: "[Biggest difference between React and Solid is that things that can change are wrapped in signals in Solid, and in dependencies arrays in React.](https://twitter.com/fabiospampinato/status/1528537000504184834)".to_string(),
                subnotes: vec![],
                url: Some("https://twitter.com/fabiospampinato/status/1528537000504184834".to_string()),
                public: None
            },
        ];

        let links = vec![
            Link {
                title: "Hope UI".to_string(),
                url: "https://github.com/fabien-ml/hope-ui".to_string(),
                public: None,
                description: Some("SolidJS component library you've hoped for.".to_string()),
                related_links: vec![],
            },
            Link {
                title: "SolidJS Docs".to_string(),
                url: "https://docs.solidjs.com/".to_string(),
                public: None,
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
                links: Some(links)
            }
        );
    }
}
