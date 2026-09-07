"use client";

import dynamic from "next/dynamic";
import type { PostMeta } from "@/content";

// Lazy-load the per-card component (motion). Keeps the initial bundle
// smaller and lets the chunk resolve while the parent layout paints.
const PostCard = dynamic(() => import("@/components/sections/postCard"), {
	loading: () => (
		<div
			className="flex min-h-72 flex-col gap-2.5 md:gap-3.5 md:min-h-56"
			aria-hidden="true"
		/>
	),
});

interface PostListProps {
	posts: PostMeta[];
}

const PostList = ({ posts }: PostListProps) => {
	return (
		<div className="flex flex-col gap-1 contain-layout">
			{posts.map((post) => (
				<PostCard
					key={post.slug}
					title={post.title}
					description={post.description}
					href={`/posts/${post.slug}`}
					date={post.date}
				/>
			))}
		</div>
	);
};

export default PostList;
