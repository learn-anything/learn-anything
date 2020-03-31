import { theme } from "@chakra-ui/core";

export default {
  ...theme,
  icons: {
    ...theme.icons,
    search: {
      path: (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </g>
      ),
    },
  },
};
