import React from 'react'
import {MDXProvider} from '@mdx-js/react'
import GlobalStyles from '../components/GlobalStyles'

const mdComponents = {
  h1: props => <h1 style={{color: 'tomato'}} {...props} />
}

export default ({Component, pageProps}) => (
  <MDXProvider components={mdComponents}>
    <GlobalStyles />
    <Component {...pageProps} />
  </MDXProvider>
)
