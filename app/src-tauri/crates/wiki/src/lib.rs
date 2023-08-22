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

    let mut pretty_topic_name = None;
    let mut content = String::new();

    let mut collecting_content = true;

    // Check for front matter title
    pretty_topic_name = extract_title_from_front_matter(markdown_string);
    log!(pretty_topic_name);

    while let Some(node) = nodes.pop_front() {
        match &node {
            Node::Heading(heading) => {
                if pretty_topic_name.is_none() {
                    pretty_topic_name = Some(
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
                                if let Node::Text(text) = &link.children[0] {
                                    let link_str = format!("[{}]({})", text.value.trim(), link.url);
                                    para_content.push_str(&link_str);
                                }
                            }
                            _ => {}
                        }
                    }

                    content.push_str(&para_content);
                    content.push(' ');
                }
            }
            _ => {}
        }

        if let Some(children) = node.children() {
            for child in children.iter().cloned() {
                nodes.push_back(child);
            }
        }
    }

    let title_str =
        pretty_topic_name.ok_or_else(|| anyhow::Error::msg("Failed to extract title"))?;
    Ok(TopicStruct {
        title: title_str,
        content: content.trim().to_string(),
        notes: None, // Placeholder, since the functionality to parse notes isn't present
        links: None, // Placeholder, since the functionality to parse links isn't present
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
        let markdown_string = r#"# Hardware

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

    //     #[test]
    //     fn test_front_matter_heading_content_notes_links() {
    //         let markdown_string = r#"---
    // title: SolidJS
    // ---

    // # [SolidJS](https://www.solidjs.com/)

    // Love Solid. Has [best parts](https://www.youtube.com/watch?v=qB5jK-KeXOs) of [React](react.md).

    // [Fine grained reactivity](https://dev.to/ryansolid/a-hands-on-introduction-to-fine-grained-reactivity-3ndf) is nice.

    // ## OSS apps

    // - [CodeImage](https://github.com/riccardoperra/codeimage)
    // - [Solid Hacker News](https://github.com/solidjs/solid-hackernews)

    // ## Notes

    // - [Solid will never "re-render" your component/function.](https://twitter.com/Axibord1/status/1606106151539687425)
    //     - Means you don't ever have to optimise re-renders.
    //     - And don't have to fight with React useEffect.
    // - [Solid Dev Tools](https://github.com/thetarnav/solid-devtools) are great.
    // - createResource makes a signal out of a promise.
    // - Builin components like [For](https://www.solidjs.com/docs/latest/api#for) and [Show](https://www.solidjs.com/docs/latest/api#show) are great.
    // - [Biggest difference between React and Solid is that things that can change are wrapped in signals in Solid, and in dependencies arrays in React.](https://twitter.com/fabiospampinato/status/1528537000504184834)

    // ## Links

    // - [Hope UI](https://github.com/fabien-ml/hope-ui) - SolidJS component library you've hoped for. ([Docs](https://hope-ui.com/docs/getting-started))
    // - [SolidJS Docs](https://docs.solidjs.com/)
    // "#;

    //         let topic = parse_md_content_as_topic(&markdown_string).unwrap();
    //         log!(topic);

    //         let notes = vec![
    //         Note {
    //             note: "[Solid will never \"re-render\" your component/function.](https://twitter.com/Axibord1/status/1606106151539687425)".to_string(),
    //             subnotes: vec![
    //                 "Means you don't ever have to optimise re-renders.".to_string(),
    //                 "And don't have to fight with React useEffect.".to_string()
    //             ],
    //             url: Some("https://twitter.com/Axibord1/status/1606106151539687425".to_string()),
    //             public: None // Based on your code, this field is optional and not provided
    //         },
    //         Note {
    //             note: "[Solid Dev Tools](https://github.com/thetarnav/solid-devtools) are great.".to_string(),
    //             subnotes: vec![],
    //             url: Some("https://github.com/thetarnav/solid-devtools".to_string()),
    //             public: None
    //         },
    //     ];

    //         assert_eq!(
    //         topic,
    //         TopicStruct {
    //             title: "SolidJS".to_string(),
    //             content: "# [SolidJS](https://www.solidjs.com/)\nLove Solid. Has [best parts](https://www.youtube.com/watch?v=qB5jK-KeXOs) of [React](react.md).\n[Fine grained reactivity](https://dev.to/ryansolid/a-hands-on-introduction-to-fine-grained-reactivity-3ndf) is nice.\n## OSS apps\n- [CodeImage](https://github.com/riccardoperra/codeimage)\n- [Solid Hacker News](https://github.com/solidjs/solid-hackernews)".to_string(),
    //             notes: None, // Add this line
    //             links: None, // And this line
    //         }
    //     );
    //     }
}
