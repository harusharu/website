import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
			<p className="mono-label text-(--accent)">404</p>
			<h1 className="text-2xl font-semibold text-(--gb-fg0)">Page not found</h1>
			<p className="text-(--gb-fg2)">This page doesn&apos;t exist.</p>
			<Link
				href="/home"
				className="text-(--accent) text-sm underline underline-offset-4"
			>
				Go home
			</Link>
		</div>
	);
}
