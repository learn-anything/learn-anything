export function initKeyboardHelper() {
  if (__IOS__) {
    const iqKeyboard = IQKeyboardManager.sharedManager();
    iqKeyboard.overrideKeyboardAppearance = true;
    iqKeyboard.keyboardAppearance = UIKeyboardAppearance.Dark;
    iqKeyboard.enableAutoToolbar = true;
    iqKeyboard.shouldShowToolbarPlaceholder = true;
    iqKeyboard.keyboardDistanceFromTextField = 15;
    iqKeyboard.shouldResignOnTouchOutside = true;
  }
}
