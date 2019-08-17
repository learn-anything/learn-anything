/** @jsx jsx */
import { jsx, useColorMode, Styled } from "theme-ui";
import Button from "./Button";
import { FunctionComponent } from "react";

const modes = ["dark", "dusk", "light"];

const Header: FunctionComponent = () => {
  const [mode, setMode] = useColorMode();

  const handleThemeChange = () => {
    const index = modes.indexOf(mode);
    const next = modes[(index + 1) % modes.length];
    setMode(next);
  };

  return (
    <header>
      <div
        sx={{
          textAlign: "center"
        }}
      >
        <Styled.a href="/">
          <svg
            sx={{
              position: "absolute",
              left: "46.5%",
              right: "53.5%",
              flex: "0 0 100px",
              width: "100px",
              height: "100px",
              minWidth: "100px",
              minHeight: "100px",
              color: "inherit",
              fill: "currentColor"
            }}
            viewBox="0 0 100 100"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M41.5 52.9971V70.9971C41.5 73.0681 43.179 74.7471 45.25 74.7471C47.3211 74.7471 49 73.0681 49 70.9971V52.9971H50V76.4971C50 78.5681 51.679 80.2471 53.75 80.2471C55.8211 80.2471 57.5 78.5681 57.5 76.4971V52.9971H58.5V62.9971C58.5 65.0681 60.179 66.7471 62.25 66.7471C64.3211 66.7471 66 65.0681 66 62.9971V34.4971C66 25.3843 58.6127 19 49.5 19C40.3873 19 33 25.3844 33 34.4971V65.9971C33 68.0681 34.679 69.7471 36.75 69.7471C38.8211 69.7471 40.5 68.0681 40.5 65.9971V52.9971H41.5ZM43.5 34.497C43.5 35.4636 42.7165 36.247 41.75 36.247C40.7835 36.247 40 35.4636 40 34.497C40 33.5305 40.7835 32.747 41.75 32.747C42.7165 32.747 43.5 33.5305 43.5 34.497ZM57.25 36.247C58.2165 36.247 59 35.4635 59 34.497C59 33.5305 58.2165 32.747 57.25 32.747C56.2835 32.747 55.5 33.5305 55.5 34.497C55.5 35.4635 56.2835 36.247 57.25 36.247ZM45 40.497C45 40.497 45 43.997 49.5 43.997C54 43.997 54 40.497 54 40.497H45Z"
            />
          </svg>
        </Styled.a>
        <div
          sx={{
            float: "right"
          }}
        >
          <Styled.a
            href="/guide/new"
            sx={{
              appearance: "none",
              fontFamily: "inherit",
              fontSize: 1,
              m: 0,
              px: 2,
              py: 2,
              color: "currentColor",
              bg: "muted",
              border: 0,
              borderRadius: 2,
              ":focus": {
                outline: "2px solid"
              }
            }}
          >
            New Guide
          </Styled.a>
          <Button sx={{ ml: 2 }} onClick={handleThemeChange}>
            {mode}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
