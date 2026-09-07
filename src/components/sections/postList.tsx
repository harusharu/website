"use client";

import PostCard from "@/components/sections/postCard";
import type { PostMeta } from "@/content";

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
