use std::ffi::OsStr;
use walkdir::WalkDir;

// get all the .md files from the given folder
pub fn get_md_files(folder_path: &str) -> Vec<String> {
    let mut paths = Vec::new();
    for entry in WalkDir::new(folder_path) {
        let entry = entry.unwrap();
        if entry.path().extension() == Some(OsStr::new("md")) {
            paths.push(entry.path().to_string_lossy().to_string());
        }
    }
    paths
}

pub fn get_content_of_file(file_path: &str) -> String {
    let content = std::fs::read_to_string(file_path).unwrap();
    content
}
