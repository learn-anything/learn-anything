# Mobile app using NativeScript

## Setup

```
npm i
```

[Bun](https://bun.sh) should in theory be supported too to get the deps too but needs testing.

## Run

Assuming you did [this setup](https://docs.nativescript.org/setup/macos#setting-up-macos-for-ios) and also ran `npm install -g nativescript`.

### iOS

And you downloaded and opened an iOS simulator (i.e. iPhone Pro 15).

```
npm run ios
```

For dev tools, can open `devtools://devtools/bundled/inspector.html?ws=localhost:41000` in chrome browser.

### Android

And you downloaded and opened an Android emulator

```
npm run android
```

For dev tools, can open `devtools://devtools/bundled/inspector.html?ws=localhost:40000` in chrome browser.

## Todo

Auth iOS using [Hanko Mobile Guide](https://docs.hanko.io/quickstarts/mobile).

Then fetch notes for user from server and be able to edit them with [SwiftDown](https://github.com/qeude/SwiftDown). Read [this discord thread](https://discord.com/channels/603595811204366337/1172303250557501601/1172339612681777213) for more context/tips on how to make it work.

## Notes

There is a repo with RN/Expo code [here](https://github.com/learn-anything/mobile-expo) that can potentially be used as testing ground for trying out RN/Expo things.

NativeScript is to be used to make the mobile app though. Just Expo/RN ecosystem is quite large so can get inspiration from it.

[Dive into NativeScript w/Nathan Walker & Ammar Ahmed](https://www.youtube.com/watch?v=j0s8w34Xh9o) is great video to understand what {N} is and can do in more detail.
