import Link from "next/link";

export default function PostNotFound() {
	return (
		<div className="flex flex-col gap-3 py-12">
			<h1 className="text-xl font-medium text-(--gb-fg0)">Post not found</h1>
			<p className="text-sm text-(--gb-fg2)">
				This post doesn&apos;t exist or may have been moved.
			</p>
			<Link
				href="/posts"
				className="text-(--accent) text-sm underline underline-offset-4"
			>
				View all posts
			</Link>
		</div>
	);
}
