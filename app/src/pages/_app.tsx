import fetch from "isomorphic-unfetch"
import { NextUrqlAppContext, withUrqlClient } from "next-urql"
import NextApp, { AppProps } from "next/app"
import React from "react"
import { DefaultSeo } from "next-seo"
import { ThemeProvider, CSSReset } from "@chakra-ui/core"

const title = "Learn Anything"
const description =
  "Organize the world's knowledge, explore connections and curate learning paths"
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
        url: "/og.jpg",
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
}

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider>
      <CSSReset />
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

App.getInitialProps = async (ctx: NextUrqlAppContext) => {
  const appProps = await NextApp.getInitialProps(ctx)

  return {
    ...appProps,
  }
}

export default withUrqlClient(() => ({
  url: "https://learn-anything-db.herokuapp.com/v1/graphql",
  fetchOptions: {
    headers: {
      "x-hasura-admin-secret": process.env.hasuraSecret,
    },
  },
  fetch,
}))(
  // @ts-ignore
  App
)
