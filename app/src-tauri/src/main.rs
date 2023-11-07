// Prevents additional console window on Windows in release
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[macro_use]
extern crate log_macro;

use serde_json::json;
use std::ffi::OsStr;
use std::fs;
use tauri::api::dialog::blocking::FileDialogBuilder;
use walkdir::WalkDir;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![connect_folder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn connect_folder() -> Option<Vec<serde_json::Value>> {
    if let Some(folder_path) = FileDialogBuilder::new().pick_folder() {
        let folder_str = folder_path.to_str().unwrap();
        let result = read_files_in_dir(folder_str);
        log!(result);
        Some(result)
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
            let file = json!({
                "filePath": path.display().to_string(),
                "fileContent": content
            });
            files.push(file);
        }
    }

    files
}
