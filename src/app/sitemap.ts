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
	const now = new Date();
	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: `${siteUrl}/`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: `${siteUrl}/home`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.95,
		},
		{
			url: `${siteUrl}/posts`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${siteUrl}/projects`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${siteUrl}/experience`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${siteUrl}/llms.txt`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.4,
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
		lastModified: now,
		changeFrequency: "monthly",
		priority: 0.7,
	}));

	return [...staticRoutes, ...postRoutes, ...projectRoutes];
};

export default sitemap;
