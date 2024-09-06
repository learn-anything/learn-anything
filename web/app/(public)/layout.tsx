export default function PublicLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return <main className="h-full">{children}</main>
}
