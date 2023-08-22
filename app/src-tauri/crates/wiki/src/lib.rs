#![allow(unused_imports)]
#![allow(dead_code)]
#![allow(unused_variables)]

#[macro_use]
extern crate log_macro;
extern crate regex; // TODO: check maybe no need for this, it compiled without this line..

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

#[derive(Debug, Clone)]
pub struct Note {
    note: String,
    subnotes: Vec<String>,
    url: Option<String>,
    public: Option<bool>, // TODO: should be not optional, temp for testing
}

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
    title: String,
    url: String,
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
    let mut collecting_content = false;

    // Check for front matter title
    let front_matter_title = extract_title_from_front_matter(markdown_string);
    if let Some(title) = front_matter_title {
        pretty_topic_name = Some(title);
        collecting_content = true;
    }

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
                } else if heading.depth > 1 {
                    // Found a Level-2 (or deeper) heading, we can stop collecting content
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

        if let Some(path_str) = test_folder_path.to_str() {
            match get_md_files(path_str) {
                Ok(paths) => {
                    if !paths.is_empty() {
                        let test_file_name = "hardware.md";
                        let test_file_name =
                            paths.iter().find(|path| path.ends_with(test_file_name));

                        match test_file_name {
                            Some(path) => {
                                let content = get_content_of_file(path);
                                let topic = parse_md_content_as_topic(&content).unwrap();
                                assert_eq!(
                            topic,
                            TopicStruct {
                                title: "Hardware".to_string(),
                                content: "[Digital Design and Computer Architecture course](https://safari.ethz.ch/digitaltechnik/spring2021/doku.php?id=start), [From Nand to Tetris](https://github.com/ghaiklor/nand-2-tetris) are great.".to_string()
                            }
                        );
                            }
                            None => {
                                eprintln!("File {:?} not found!", test_file_name);
                            }
                        }
                    }
                }
                Err(e) => eprintln!("Error: {}", e),
            }
        } else {
            println!("Path is not valid UTF-8");
        }
    }

    #[test]
    fn test_md_file_with_heading_and_content_and_notes_and_links() {
        let test_folder_path = get_test_folder_path();

        if let Some(path_str) = test_folder_path.to_str() {
            match get_md_files(path_str) {
                Ok(paths) => {
                    if !paths.is_empty() {
                        let test_file_name = "solid.md";
                        let test_file_name =
                            paths.iter().find(|path| path.ends_with(test_file_name));

                        match test_file_name {
                            Some(path) => {
                                let content = get_content_of_file(path);
                                let topic = parse_md_content_as_topic(&content).unwrap();
                            }
                            None => {
                                eprintln!("File {:?} not found!", test_file_name);
                            }
                        }
                    }
                }
                Err(e) => eprintln!("Error: {}", e),
            }
        } else {
            println!("Path is not valid UTF-8");
        }
    }
}
