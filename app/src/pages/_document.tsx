import NextDocument, { Html, Head, Main, NextScript } from "next/document"

class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="icon"
            media="(prefers-color-scheme:dark)"
            href="/favicon-dark.png"
            type="image/png"
          />
          <link
            rel="icon"
            media="(prefers-color-scheme:light)"
            href="/favicon-light.png"
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
      </Html>
    )
  }
}

export default Document
