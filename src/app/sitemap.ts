import type { MetadataRoute } from "next";
import { projects, siteUrl } from "@/content";
import { getPosts } from "@/lib/posts";

const parseLastModified = (dateString: string) => {
	const parsedDate = new Date(dateString);
	if (Number.isNaN(parsedDate.getTime())) {
		return new Date();
	}

	return parsedDate;
};

const sitemap = (): MetadataRoute.Sitemap => {
	// lastModified only where a real content date exists — "now" on every build
	// rewrites all lastmods and teaches Google to ignore the signal.
	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: `${siteUrl}/`,
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			url: `${siteUrl}/home`,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${siteUrl}/posts`,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${siteUrl}/projects`,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${siteUrl}/experience`,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${siteUrl}/resume`,
			changeFrequency: "monthly",
			priority: 0.3,
		},
	];

	const postRoutes: MetadataRoute.Sitemap = getPosts().map((post) => ({
		url: `${siteUrl}/posts/${post.slug}`,
		lastModified: parseLastModified(post.date),
		changeFrequency: "monthly",
		priority: 0.7,
	}));

	const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
		url: `${siteUrl}/projects/${project.slug}`,
		changeFrequency: "monthly",
		priority: 0.7,
	}));

	return [...staticRoutes, ...postRoutes, ...projectRoutes];
};

export default sitemap;
