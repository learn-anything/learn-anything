import { defineConfig } from "@tanstack/react-start/config"
import tsConfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tailwindcss(),
    ],
  },
  server: {
    preset: "vercel",
  },
  tsr: {
    customScaffolding: {
      routeTemplate: [
        "%%tsrImports%%",
        "\n\n",
        "function RouteComponent() { return <></> };\n\n",
        "%%tsrExportStart%%{\n component: RouteComponent\n }%%tsrExportEnd%%\n",
      ].join(""),
    },
  },
})
