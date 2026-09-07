import PostList from "@/components/sections/postList";
import SectionHeading from "@/components/ui/SectionHeading";
import ViewAllLink from "@/components/ui/ViewAllLink";
import { getPosts } from "@/lib/posts";

const VISIBLE_POST_COUNT = 2;

const Posts = () => {
	const posts = getPosts();
	const visiblePosts = posts.slice(0, VISIBLE_POST_COUNT);
	const hasMore = posts.length > VISIBLE_POST_COUNT;

	return (
		<section id="posts" className="section-fluid flex flex-col gap-3">
			<SectionHeading title="Posts" />

			{posts.length === 0 ? (
				<div className="text-(--gb-fg2)">No posts published yet.</div>
			) : (
				<PostList posts={visiblePosts} />
			)}

			{hasMore && <ViewAllLink href="/posts" label="View all posts" />}
		</section>
	);
};

export default Posts;
