import React from 'react'
import App, { Container } from 'next/app'
import { ThemeProvider, Styled, ColorMode } from 'theme-ui'

import Header from '../components/Header'
import Footer from '../components/Footer'
import theme from '../src/theme'

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <ThemeProvider theme={theme}>
          <ColorMode />
          <Header />
          <Styled.root>
            <Component {...pageProps} />
          </Styled.root>
          <Footer />
        </ThemeProvider>
      </Container>
    )
  }
}

export default MyApp