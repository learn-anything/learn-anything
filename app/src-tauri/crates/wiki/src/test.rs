use std::env;
use std::path::PathBuf;

pub fn get_test_folder_path() -> PathBuf {
    // Get the current file's directory
    let current_dir = env::current_dir().expect("Failed to get current directory");

    // Transform the directory path
    let new_path = current_dir
        .to_str()
        .expect("Failed to convert path to string")
        .replace("/crates/markdown", "/seed/wiki/test");

    // Convert the new path back to a PathBuf
    PathBuf::from(new_path)
}
