import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  // @import url('https://rsms.me/inter/inter.css');
  @import url('https://indestructibletype.com/fonts/Jost.css');

  // @supports (font-variation-settings: normal) {
  //   html { font-family: 'Inter var', sans-serif; }
  // }
  
  :root {
    --text: 0, 0, 0;
    --background: 255, 255, 255;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --text: 255, 255, 255;
      --background: 0, 0, 0;
    }
  }

  html,
  body {
    font-family: 'Jost';
    background-color: rgb(var(--background));
    color: rgb(var(--text));
  }
`;

export default GlobalStyles
