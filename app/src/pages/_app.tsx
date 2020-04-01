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

const SEO = {
  title: "Learn Anything",
  description: "", // TODO
  canonical: "https://learn-anything.xyz",
  openGraph: {
    // TODO
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
        <ColorModeProvider>
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
