import type { Metadata } from "next";
import PostList from "@/components/sections/postList";
import BackLink from "@/components/ui/BackLink";
import SectionHeading from "@/components/ui/SectionHeading";
import { defaultOgImage } from "@/content";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
	title: "Posts — Systems, Backend & Linux",
	description:
		"Technical writing on distributed systems, backend engineering, and Linux internals — tracing, webhooks, rate limiting, migrations, and recovery guides.",
	alternates: {
		canonical: "/posts",
	},
	openGraph: {
		title: "Posts — Systems, Backend & Linux | Harshal Sawant",
		description:
			"Technical writing on distributed systems, backend engineering, and Linux internals — tracing, webhooks, rate limiting, migrations, and recovery guides.",
		url: "/posts",
		images: [defaultOgImage],
	},
	twitter: {
		card: "summary_large_image",
		title: "Posts — Systems, Backend & Linux | Harshal Sawant",
		description:
			"Technical writing on distributed systems, backend engineering, and Linux internals — tracing, webhooks, rate limiting, migrations, and recovery guides.",
		images: [defaultOgImage],
	},
};
export const dynamic = "force-static";

const PostsPage = () => {
	const posts = getPosts();

	return (
		<section className="flex flex-col gap-4">
			<div className="flex items-center justify-between gap-2">
				<SectionHeading title="Posts" as="h1" />
				<BackLink href="/home" label="Home" />
			</div>

			<div className="content-rail flex flex-col gap-1">
				{posts.length > 0 ? (
					<PostList posts={posts} />
				) : (
					<p className="text-(--gb-fg2)">No posts published yet.</p>
				)}
			</div>
		</section>
	);
};

export default PostsPage;
