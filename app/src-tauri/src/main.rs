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
use tauri::Manager;
use walkdir::WalkDir;

fn main() {
    // prepare() checks if it's a single instance and tries to send the args otherwise.
    // It should always be the first line in your main function (with the exception of loggers or similar)
    tauri_plugin_deep_link::prepare("xyz.learn-anything");
    // It's expected to use the identifier from tauri.conf.json
    // Unfortuenetly getting it is pretty ugly without access to sth that implements `Manager`.

    tauri::Builder::default()
    .setup(|app| {
      // If you need macOS support this must be called in .setup() !
      // Otherwise this could be called right after prepare() but then you don't have access to tauri APIs
      let handle = app.handle();
      tauri_plugin_deep_link::register(
        "my-scheme",
        move |request| {
          dbg!(&request);
          handle.emit_all("scheme-request-received", request).unwrap();
        },
      )
      .unwrap(/* If listening to the scheme is optional for your app, you don't want to unwrap here. */);

      // If you also need the url when the primary instance was started by the custom scheme, you currently have to read it yourself
      /*
      #[cfg(not(target_os = "macos"))] // on macos the plugin handles this (macos doesn't use cli args for the url)
      if let Some(url) = std::env::args().nth(1) {
        app.emit_all("scheme-request-received", url).unwrap();
      }
      */

      Ok(())
    })
    // .plugin(tauri_plugin_deep_link::init()) // consider adding a js api later
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
        let mut file = fs::OpenOptions::new()
            .write(true)
            .truncate(true)
            .open(&path)
            .map_err(|e| format!("Failed to open file: {}", e))?;

        file.write_all(new_content.as_bytes())
            .map(|_| ())
            .map_err(|e| format!("Failed to write to file: {}", e))
    } else {
        Err("File does not exist".into())
    }
}
