export default function AuthLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return <main className="h-full">{children}</main>
}
