import Document, { Head, Main, NextScript } from "next/document";
import React from "react";

class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
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
          <Main />
          <NextScript />
        </body>
        <script
          src="/static/noflash.ts"
          crossOrigin="anonymous"
          type="application/typescript"
        />
      </html>
    );
  }
}

export default MyDocument;
