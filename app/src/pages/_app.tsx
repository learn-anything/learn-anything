import React from "react";
import NextApp from "next/app";
import { DefaultSeo } from "next-seo";

import "../styles.css";

const title = "Learn Anything";
const description = ""; // TODO
const SEO = {
  title,
  description,
  canonical: "https://learn-anything.xyz",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://learn-anything.xyz",
    title,
    description,
    images: [
      {
        url: "/static/images/og.jpg",
        alt: title,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    handle: "@learnanything_",
    site: "@learnanything_",
    cardType: "summary_large_image",
  },
};

class App extends NextApp {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <DefaultSeo {...SEO} />
        <Component {...pageProps} />
      </>
    );
  }
}

export default App;
