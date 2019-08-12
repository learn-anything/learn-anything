import * as themeUi from 'theme-ui'
const _ColorMode = require('theme-ui').ColorMode
const _InitializeColorMode = require('theme-ui').InitializeColorMode

declare module 'theme-ui' {
    export const ColorMode = _ColorMode
    export const InitializeColorMode = _InitializeColorMode
}