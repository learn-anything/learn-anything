import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

import { themeStorageKey } from "../lib/theme";
const bgVariableName = "--bg";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="icon"
            media="(prefers-color-scheme:dark)"
            href="/static/favicons/favicon-dark.png"
            type="image/png"
          />
          <link
            rel="icon"
            media="(prefers-color-scheme:light)"
            href="/static/favicons/favicon-light.png"
            type="image/png"
          />
          <script
            src="https://unpkg.com/favicon-switcher@1.2.2/dist/index.js"
            crossOrigin="anonymous"
            type="application/javascript"
          />
        </Head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function() {
                try {
                  var mode = localStorage.getItem('${themeStorageKey}')
                  if (!mode) return
                  document.documentElement.classList.add(mode)
                  var bgValue = getComputedStyle(document.documentElement)
                    .getPropertyValue('${bgVariableName}')
                  document.documentElement.style.background = bgValue
                } catch (e) {}
              })()`,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
