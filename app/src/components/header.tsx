import React from "react";
import useTheme from "../lib/theme";
import { User } from "./icons";

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: "var(--gap)",
        marginBottom: "var(--gap)",
      }}
    >
      <div>
        <a href="/" style={{ backgroundImage: "none" }}>
          <svg height="40" viewBox="0 0 33 62" fill="var(--fg)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.50003 33.9971V51.997C8.50003 54.0681 10.179 55.747 12.25 55.747C14.3211 55.747 16 54.0681 16 51.997V33.9971H17V57.497C17 59.5681 18.679 61.247 20.75 61.247C22.8211 61.247 24.5 59.5681 24.5 57.497V33.9971H25.5V43.997C25.5 46.0681 27.179 47.7471 29.25 47.7471C31.3211 47.7471 33 46.0681 33 43.997V15.4971C33 6.38435 25.6127 1.90735e-05 16.5 1.90735e-05C7.38729 1.90735e-05 0 6.38438 0 15.4971L3.05176e-05 46.997C3.05176e-05 49.0681 1.67895 50.747 3.75002 50.747C5.82109 50.747 7.50003 49.0681 7.50003 46.997V33.9971H8.50003ZM24.25 17.247C25.2165 17.247 26 16.4635 26 15.497C26 14.5305 25.2165 13.747 24.25 13.747C23.2835 13.747 22.5 14.5305 22.5 15.497C22.5 16.4635 23.2835 17.247 24.25 17.247ZM12 21.497C12 21.497 12 24.997 16.5 24.997C21 24.997 21 21.497 21 21.497H12ZM10.5 15.497C10.5 16.4635 9.7165 17.247 8.75 17.247C7.7835 17.247 7 16.4635 7 15.497C7 14.5305 7.7835 13.747 8.75 13.747C9.7165 13.747 10.5 14.5305 10.5 15.497Z"
            />
          </svg>
        </a>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <a
          href="/login"
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "var(--gap)",
            backgroundImage: "none",
          }}
        >
          <User />
        </a>
        <button onClick={toggleTheme}>
          <style jsx>{`
            button {
              --size: 20px;
              height: var(--size);
              width: var(--size);
              border: 2px solid var(--fg);
              border-radius: 50%;
              background: transparent;
              cursor: pointer;
              transition: border-color 0.1s ease-in-out;
            }
            button:hover,
            button:focus {
              outline: none;
            }
          `}</style>
        </button>
      </div>
    </div>
  );
};

export default Header;
