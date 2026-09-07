// biome-ignore-all lint/security/noDangerouslySetInnerHtml: rendered markdown comes from local post files.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackLink from "@/components/ui/BackLink";
import { defaultOgImage, profile, siteUrl } from "@/content";
import { getPostBySlug, getPosts, renderMarkdown } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

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
	const postUrl = `${siteUrl}/posts/${post.slug}`;

	const blogPostingJsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		description: post.description,
		datePublished: post.date,
		url: postUrl,
		mainEntityOfPage: postUrl,
		author: {
			"@type": "Person",
			name: profile.name,
			url: siteUrl,
		},
	};

	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: `${siteUrl}/home`,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Posts",
				item: `${siteUrl}/posts`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: post.title,
				item: postUrl,
			},
		],
	};

	return (
		<article className="content-rail flex flex-col gap-4">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
			/>
			<div className="flex flex-wrap items-center justify-between gap-2">
				<p className="mono-label tnum">
					By {profile.name} ·{" "}
					<time dateTime={post.date}>{formatDate(post.date, "long")}</time>
				</p>
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
