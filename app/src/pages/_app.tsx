import { CSSReset, ThemeProvider } from "@chakra-ui/core"
import fetch from "isomorphic-unfetch"
import { DefaultSeo } from "next-seo"
import { NextUrqlAppContext, withUrqlClient } from "next-urql"
import NextApp, { AppProps } from "next/app"
import { AuthProvider } from "../lib/auth"
import customTheme from "../theme"

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
    <ThemeProvider theme={customTheme}>
      <AuthProvider>
        <CSSReset />
        <DefaultSeo {...SEO} />
        <Component {...pageProps} />
      </AuthProvider>
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
      "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_SECRET,
    },
  },
  fetch,
}))(
  // @ts-ignore
  App
)
