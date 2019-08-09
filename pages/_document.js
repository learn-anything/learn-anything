import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { applyColorModeFromLocalStorage } from 'theme-ui'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return initialProps
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <script
            dangerouslySetInnerHTML={{ __html: applyColorModeFromLocalStorage }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
