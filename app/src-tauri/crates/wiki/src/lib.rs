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

// TODO: &'a looks ugly, is there a better way?
#[derive(Debug, PartialEq)]
pub struct TopicStruct {
    title: String,
    content: String,
}

// Equivalent of TypeScript's 'Note' type
#[derive(Debug, Clone)]
pub struct Note {
    note: String,
    subnotes: Vec<String>,
    url: Option<String>,
    public: Option<bool>, // TODO: should be not optional, temp for testing
}

// Equivalent of TypeScript's 'Link' type
#[derive(Debug, Clone)]
pub struct Link {
    title: String,
    url: String,
    public: Option<bool>, // TODO: should be not optional, temp for testing
    description: Option<String>,
    related_links: Vec<RelatedLink>,
}

#[derive(Debug, Clone)]
pub struct RelatedLink {
    // Define fields for RelatedLink
    // For now, it's empty, but you can add fields as per your requirements
}

// parse markdown file, extract topic
pub fn parse_md_content_as_topic<'a>(markdown_string: &'a str) -> Result<TopicStruct> {
    let options = ParseOptions::default();
    let ast = to_mdast(markdown_string, &options).map_err(anyhow::Error::msg)?;
    log!(ast);

    let mut nodes = VecDeque::new();
    nodes.push_back(ast);

    // let mut topic_name = None;
    let mut pretty_topic_name = None;
    let mut content = String::new();
    let mut collecting_content = false;

    // let topicName = path.basename(filePath, path.extname(filePath))
    // let prettyTopicName
    // let content = ""
    // let notes: Note[] = []
    // let links: Link[] = []

    // let parsingNotes = false
    // let parsingLinks = false
    // let parsingFrontMatter = false
    // let gotTitleFromFrontMatter = false
    // let gotTitle = false

    while let Some(node) = nodes.pop_front() {
        match &node {
            Node::Heading(heading) => {
                if pretty_topic_name.is_none() {
                    pretty_topic_name = Some(
                        heading
                            .children
                            .iter()
                            .filter_map(|child| {
                                log!(child);
                                if let Node::Text(text) = child {
                                    Some(text.value.clone())
                                } else {
                                    None
                                }
                            })
                            .collect::<Vec<String>>()
                            .join(" "),
                    );
                    collecting_content = true;
                } else {
                    // Found another heading, we can stop collecting content
                    collecting_content = false;
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
    fn test_md_file_with_heading_and_content_only() {
        let test_folder_path = get_test_folder_path();

        // Attempt to convert to a str, will return None if the path is not valid UTF-8
        if let Some(path_str) = test_folder_path.to_str() {
            let paths = get_md_files(path_str);
            if !paths.is_empty() {
                let content = get_content_of_file(&paths[0]);
                log!(content);
                let topic = parse_md_content_as_topic(&content).unwrap();
                log!(topic.content);
                assert_eq!(
                    topic,
                    TopicStruct {
                        title: "Hardware".to_string(),
                        content: "[Digital Design and Computer Architecture course](https://safari.ethz.ch/digitaltechnik/spring2021/doku.php?id=start), [From Nand to Tetris](https://github.com/ghaiklor/nand-2-tetris) are great.".to_string()
                    }
                );
            }
        } else {
            println!("Path is not valid UTF-8");
        }
    }
}
