import React from 'react'
import App, {Container, AppContext} from 'next/app'
import {ThemeProvider, Styled, ColorMode} from 'theme-ui'

import Header from '../components/Header'
import Footer from '../components/Footer'
import theme from '../src/theme'

class LearnAnythingApp extends App {
    static async getInitialProps(context: AppContext) {
        let pageProps = {}

        if (context.Component.getInitialProps) {
            pageProps = await context.Component.getInitialProps(context.ctx)
        }

        return {pageProps}
    }

    render() {
        const {Component, pageProps} = this.props

        return (
            <Container>
                <ThemeProvider theme={theme}>
                    <ColorMode />
                    <Header/>
                    <Styled.root>
                        <Component {...pageProps} />
                    </Styled.root>
                    <Footer/>
                </ThemeProvider>
            </Container>
        )
    }
}

export default LearnAnythingApp
