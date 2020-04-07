import React from "react";
import NextApp from "next/app";
import { Global, css } from "@emotion/core";
import { DefaultSeo } from "next-seo";
import {
  ThemeProvider,
  CSSReset,
  ColorModeProvider,
  useColorMode,
} from "@chakra-ui/core";

import theme from "../theme";

const GlobalStyle = ({ children }) => {
  const { colorMode } = useColorMode();

  return (
    <>
      <CSSReset />
      <Global
        styles={css`
          #__next {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background: ${colorMode === "light" ? "white" : "#171923"};
          }
        `}
      />
      {children}
    </>
  );
};

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
    const { Component } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <CSSReset />
        {/* TODO: remove once https://github.com/chakra-ui/chakra-ui/issues/305 is resolved */}
        <ColorModeProvider value="dark">
          <GlobalStyle>
            <DefaultSeo {...SEO} />
            <Component />
          </GlobalStyle>
        </ColorModeProvider>
      </ThemeProvider>
    );
  }
}

export default App;
