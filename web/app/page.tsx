import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-full items-center justify-center">
      <Link href="/inbox">
        <Button>Go to main page</Button>
      </Link>
    </div>
  )
}
