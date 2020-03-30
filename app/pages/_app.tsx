import {MDXProvider} from '@mdx-js/react';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import customTheme from '../components/theme';
import { DefaultSeo } from 'next-seo';

const mdComponents = {
  h1: props => <h1 style={{color: 'tomato'}} {...props} />
}

const SeoConfig = {
  title: 'Learn Anything',
  description: '',
  openGraph: {
    // TODO
  },
  twitter: {
    handle: '@learnanything_',
    site: '@learnanything_',
    cardType: 'summary_large_image'
  }
};

export default ({Component, pageProps}) => (
  <>
    <DefaultSeo {...SeoConfig} />
    <MDXProvider components={mdComponents}>
      <ThemeProvider theme={customTheme}>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    </MDXProvider>
  </>
)
