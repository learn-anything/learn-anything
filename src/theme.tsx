export default {
  initialColorMode: "dark",
  colors: {
    text: "#F5F5F5",
    background: "#000",
    primary: "#3cf",
    secondary: "#e0f",
    muted: "#191919",
    highlight: "#ffffcc",
    gray: "#999",
    purple: "#c0f",
    modes: {
      dusk: {
        text: "#F5F5F5",
        background: "#282C34",
        primary: "#3cf",
        secondary: "#e0f",
        muted: "#191919",
        highlight: "#ffffcc",
        gray: "#999",
        purple: "#c0f"
      },
      light: {
        text: "#000",
        background: "#fff", // change to '#F5F5F5'
        primary: "#33e",
        secondary: "#119",
        muted: "#f6f6f6",
        highlight: "#ffffcc",
        gray: "#777",
        purple: "#609"
      }
    }
  },
  styles: {
    a: {
      color: "text",
      "&:hover": {
        color: "#5C6166"
      }
    }
  }
};
