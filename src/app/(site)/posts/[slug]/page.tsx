// biome-ignore-all lint/security/noDangerouslySetInnerHtml: rendered markdown comes from local post files.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackLink from "@/components/ui/BackLink";
import { defaultOgImage, profile } from "@/content";
import { getPostBySlug, getPosts, renderMarkdown } from "@/lib/posts";
import { formatLongDate } from "@/lib/utils";

type PostPageProps = {
	params: Promise<{
		slug: string;
	}>;
};

export const generateStaticParams = () => {
	return getPosts().map((post) => ({
		slug: post.slug,
	}));
};

export const dynamicParams = false;

export const generateMetadata = async ({
	params,
}: PostPageProps): Promise<Metadata> => {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	if (!post) {
		return {
			title: "Post Not Found",
		};
	}

	return {
		title: post.title,
		description: post.description,
		alternates: {
			canonical: `/posts/${post.slug}`,
		},
		openGraph: {
			title: post.title,
			description: post.description,
			type: "article",
			url: `/posts/${post.slug}`,
			publishedTime: post.date,
			authors: [profile.name],
			images: [
				{
					url: defaultOgImage,
					width: 1200,
					height: 630,
					alt: post.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description: post.description,
			images: [defaultOgImage],
			creator: `@${profile.twitterHandle}`,
		},
	};
};

const PostPage = async ({ params }: PostPageProps) => {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	if (!post) {
		notFound();
	}

	const htmlContent = await renderMarkdown(post.content);

	return (
		<article className="content-rail flex flex-col gap-4">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<time dateTime={post.date} className="mono-label tnum">
					{formatLongDate(post.date)}
				</time>
				<BackLink href="/posts" label="All posts" />
			</div>

			<h1 className="wrap-break-word text-2xl font-bold text-(--gb-fg0)">
				{post.title}
			</h1>
			<p className="wrap-break-word text-(--gb-fg2)">{post.description}</p>

			<div
				className="post-prose flex flex-col gap-4"
				dangerouslySetInnerHTML={{ __html: htmlContent }}
			/>
		</article>
	);
};

export default PostPage;
