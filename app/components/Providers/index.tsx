import SEO from './SEO';
import GlobalStyles from './GlobalStyles';

export default ({ children }) => {
  return (
    <>
      <SEO />
      <>
        <GlobalStyles />
        {children}
      </>
    </>
  )
}
