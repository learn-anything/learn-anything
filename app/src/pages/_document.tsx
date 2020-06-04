import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import { themeStorageKey } from '../lib/theme'

class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function() {
                try {
                  var mode = localStorage.getItem('${themeStorageKey}')
                  console.log(mode)
                  if (!mode) return
                  if (mode == "light") document.documentElement.classList.add(mode)
                } catch (e) {}
              })()`,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default Document
