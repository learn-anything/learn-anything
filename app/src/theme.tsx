import React from "react"
import { theme as chakraTheme } from "@chakra-ui/core"

const theme = {
  ...chakraTheme,
  icons: {
    ...chakraTheme.icons,
    logo: {
      path: (
        <path
          d="M8.5 33.997v18a3.75 3.75 0 107.5 0v-18h1v23.5a3.75 3.75 0 007.5 0v-23.5h1v10a3.75 3.75 0 007.5 0v-28.5C33 6.384 25.613 0 16.5 0S0 6.384 0 15.497v31.5a3.75 3.75 0 107.5 0v-13h1zm15.75-16.75a1.75 1.75 0 100-3.5 1.75 1.75 0 000 3.5zM12 21.497s0 3.5 4.5 3.5 4.5-3.5 4.5-3.5h-9zm-1.5-6a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      ),
      viewBox: "0 0 33 62",
    },
  },
}

export default theme
