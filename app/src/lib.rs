mod browser;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	tauri::Builder::default()
		.invoke_handler(tauri::generate_handler![browser::get_current_browser_url])
		.plugin(tauri_plugin_fs::init())
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}
