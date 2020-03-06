import { DefaultSeo } from 'next-seo';

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


export default function SEO() {
  return (
    <>
      <DefaultSeo {...SeoConfig} />
    </>
  )
}
