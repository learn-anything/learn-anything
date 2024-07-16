import { cn } from "@/lib/utils"

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <main className={cn("max-h-screen")}>
        <div>{children}</div>
      </main>
    </div>
  )
}
