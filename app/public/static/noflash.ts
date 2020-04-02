// https://github.com/donavon/use-dark-mode/blob/develop/noflash.js.txt
// This will help to prevent a flash if dark mode is the default.

(function () {
  const storageKey = "darkMode";
  const classNameDark = "dark-theme";
  const classNameLight = "light-theme";

  function setClassOnDocumentBody(darkMode: boolean) {
    document.documentElement.classList.add(
      darkMode ? classNameDark : classNameLight
    );
    document.documentElement.classList.remove(
      darkMode ? classNameLight : classNameDark
    );
  }

  const preferDarkQuery = "(prefers-color-scheme: dark)";
  const mql = window.matchMedia(preferDarkQuery);
  const supportsColorSchemeQuery = mql.media === preferDarkQuery;
  let localStorageTheme = null;

  try {
    localStorageTheme = localStorage.getItem(storageKey);
  } catch (err) {
    // Ignore.
  }

  let localStorageExists = false;
  if (localStorageTheme !== null) {
    localStorageExists = true;
    localStorageTheme = JSON.parse(localStorageTheme);
  }

  // Determine the source of truth
  if (localStorageExists) {
    // source of truth from localStorage
    setClassOnDocumentBody(localStorageTheme);
  } else if (supportsColorSchemeQuery) {
    // source of truth from system
    setClassOnDocumentBody(mql.matches);
    localStorage.setItem(storageKey, JSON.stringify(mql.matches));
  } else {
    // source of truth from document.documentElement
    const isDarkMode = document.documentElement.classList.contains(
      classNameDark
    );
    localStorage.setItem(storageKey, JSON.stringify(isDarkMode));
  }
})();
