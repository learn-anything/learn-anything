import { ClerkProvider as BaseClerkProvider } from "@clerk/tanstack-start"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

interface ClerkProviderProps {
  children: React.ReactNode
}

export const ClerkProvider: React.FC<ClerkProviderProps> = ({ children }) => {
  const { theme, systemTheme } = useTheme()

  const isDarkTheme =
    theme === "dark" || (theme === "system" && systemTheme === "dark")

  const appearance = {
    baseTheme: isDarkTheme ? dark : undefined,
    variables: { colorPrimary: isDarkTheme ? "#dddddd" : "#2e2e2e" },
  }

  return (
    <BaseClerkProvider appearance={appearance}>{children}</BaseClerkProvider>
  )
}
