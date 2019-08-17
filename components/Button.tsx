/** @jsx jsx */
import { jsx } from "theme-ui";
import { FunctionComponent } from "react";

type ButtonProps = {
  onClick: () => void;
};

const Button: FunctionComponent<ButtonProps> = props => (
  <button
    {...props}
    sx={{
      appearance: "none",
      fontFamily: "inherit",
      fontSize: 1,
      m: 0,
      px: 2,
      py: 2,
      color: "text",
      bg: "muted",
      border: 0,
      borderRadius: 2,
      ":focus": {
        outline: "2px solid"
      },
      cursor: "pointer"
    }}
  />
);

export default Button;
