"use client"

import Link from "next/link"
import { buttonVariants } from "../ui/button"
import { cn } from "@/lib/utils"

export const PublicHomeRoute: React.FC = () => {
	return (
		<div className="flex min-h-full flex-col justify-center">
			<div className="mx-auto w-full max-w-2xl p-4 text-center">
				<h1 className="text-center text-3xl font-bold">Welcome to the Public Home Route</h1>
				<p className="text-muted-foreground text-center">This is a public route that anyone can access</p>
				<Link href="/1password" className={cn("mt-4", buttonVariants({ variant: "default" }))}>
					Go to random topic
				</Link>
			</div>
		</div>
	)
}
