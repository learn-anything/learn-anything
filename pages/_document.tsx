import React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext
} from "next/document";
import { InitializeColorMode } from "theme-ui";

class LearnAnythingDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    return await Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html>
        <Head />
        <InitializeColorMode />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default LearnAnythingDocument;
