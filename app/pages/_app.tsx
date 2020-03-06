import {MDXProvider} from '@mdx-js/react';
import Providers from '../components/Providers';

const mdComponents = {
  h1: props => <h1 style={{color: 'tomato'}} {...props} />
}

export default ({Component, pageProps}) => (
  <MDXProvider components={mdComponents}>
    <Providers>
      <Component {...pageProps} />
    </Providers>
  </MDXProvider>
)
