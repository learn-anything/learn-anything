// Prevents additional console window on Windows in release
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![pick_folder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use std::path::PathBuf;

use tauri::api::dialog::blocking::FileDialogBuilder;

#[tauri::command]
async fn pick_folder() -> Option<PathBuf> {
    let folder_path = FileDialogBuilder::new().pick_folder();
    folder_path
}
