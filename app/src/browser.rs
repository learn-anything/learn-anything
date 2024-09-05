use osakit::declare_script;
use serde::{Deserialize, Serialize};

declare_script! {
	#[language(JavaScript)]
	#[source(r#"
		function safari(name, index) {
			return Application(name).windows[index].currentTab.url();
		}

		function chrome(name, index) {
			return Application(name).windows[index].activeTab().url();
		}
	"#)]
	pub Browser {
		pub fn safari(name: &str, index: usize) -> String;
		pub fn chrome(name: &str, index: usize) -> String;
	}
}

#[derive(Debug, Copy, Clone, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Kind {
	Safari,
	Chrome,
}

#[derive(Debug, thiserror::Error)]
pub enum Error {
	#[error("unable to run JXA function")]
	JxaRunError(#[from] osakit::ScriptFunctionRunError),
}

impl serde::Serialize for Error {
	fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
	where
		S: serde::ser::Serializer,
	{
		serializer.serialize_str(self.to_string().as_ref())
	}
}

#[tauri::command]
pub fn get_current_browser_url(kind: Kind, name: &str, window: usize) -> Result<String, Error> {
	let browser = Browser::new().expect("successful script compilation");
	Ok(match kind {
		Kind::Safari => browser.safari(name, window)?,
		Kind::Chrome => browser.chrome(name, window)?,
	})
}
