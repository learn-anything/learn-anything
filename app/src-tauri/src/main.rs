// Prevents additional console window on Windows in release
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[allow(unused_imports)]
#[macro_use]
extern crate log_macro;

use serde_json::json;
use std::ffi::OsStr;
use std::fs;
use std::path::PathBuf;
use tauri::api::dialog::blocking::FileDialogBuilder;
use walkdir::WalkDir;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            connect_folder,
            connect_folder_with_path,
            overwrite_file_content
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn connect_folder_with_path(path: String) -> Option<(String, Vec<serde_json::Value>)> {
    let folder_path = PathBuf::from(&path);
    if folder_path.exists() {
        let folder_str = folder_path.to_str().unwrap().to_string();
        let result = read_files_in_dir(&folder_str);
        Some((folder_str, result))
    } else {
        None
    }
}

#[tauri::command]
async fn connect_folder() -> Option<(String, Vec<serde_json::Value>)> {
    if let Some(folder_path) = FileDialogBuilder::new().pick_folder() {
        let folder_str = folder_path.to_str().unwrap().to_string();
        let result = read_files_in_dir(&folder_str);
        Some((folder_str, result))
    } else {
        None
    }
}

fn read_files_in_dir(dir_path: &str) -> Vec<serde_json::Value> {
    let mut files = Vec::new();

    for entry in WalkDir::new(dir_path) {
        let entry = entry.unwrap();
        let path = entry.path();
        if path.extension() == Some(OsStr::new("md")) {
            let content = fs::read_to_string(path).unwrap();
            let relative_path = path.strip_prefix(dir_path).unwrap().display().to_string();
            let file = json!({
                "filePath": relative_path,
                "fileContent": content
            });
            files.push(file);
        }
    }
    files
}

// TODO: improve: https://discord.com/channels/616186924390023171/1172127015453851709/1172132128855687178
#[tauri::command]
async fn overwrite_file_content(path: String, new_content: String) -> Result<(), String> {
    use std::io::Write;

    let path = PathBuf::from(&path);
    if path.exists() {
        let mut file = match fs::OpenOptions::new()
            .write(true)
            .truncate(true)
            .open(&path)
        {
            Ok(file) => file,
            Err(e) => return Err(format!("Failed to open file: {}", e)),
        };

        match file.write_all(new_content.as_bytes()) {
            Ok(_) => Ok(()),
            Err(e) => Err(format!("Failed to write to file: {}", e)),
        }
    } else {
        Err("File does not exist".into())
    }
}
