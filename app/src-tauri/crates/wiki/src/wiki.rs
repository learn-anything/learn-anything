use std::ffi::OsStr;
use std::fs;
use std::io;
use std::path::Path;
use walkdir::WalkDir;

// get all .md files from folder
pub fn get_md_files(folder_path: &str) -> Result<Vec<String>, io::Error> {
    if !Path::new(folder_path).exists() {
        return Err(io::Error::new(
            io::ErrorKind::NotFound,
            format!(
                "Folder '{}' does not exist. Run `bun dev-setup` at root of project.",
                folder_path
            ),
        ));
    }

    let mut paths = Vec::new();
    for entry in WalkDir::new(folder_path) {
        let entry = entry.map_err(|e| io::Error::new(io::ErrorKind::Other, e))?;
        if entry.path().extension() == Some(OsStr::new("md")) {
            paths.push(entry.path().to_string_lossy().to_string());
        }
    }

    Ok(paths)
}

pub fn get_content_of_file(file_path: &str) -> String {
    let content = std::fs::read_to_string(file_path).unwrap();
    content
}
