import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  // @import url('https://rsms.me/inter/inter.css');
  @import url('https://indestructibletype.com/fonts/Jost.css');

  // @supports (font-variation-settings: normal) {
  //   html { font-family: 'Inter var', sans-serif; }
  // }
  
  html {
    font-family: 'Jost';
  }
`;

export default GlobalStyles