import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import type { PostMeta } from "@/content";

// Markdown source files for post content.
const postsDirectory = path.join(process.cwd(), "src/content/posts");
const markdownProcessor = remark().use(remarkGfm).use(remarkHtml, {
	sanitize: false,
});

interface Post extends PostMeta {
	content: string;
}

const byDateDesc = (a: PostMeta, b: PostMeta) =>
	new Date(b.date).getTime() - new Date(a.date).getTime();

const parsePost = (fileName: string): Post | null => {
	const slug = fileName.replace(/\.md$/, "");

	try {
		const filePath = path.join(postsDirectory, fileName);
		const source = fs.readFileSync(filePath, "utf8");
		const { data, content } = matter(source);

		return {
			slug,
			title: typeof data.title === "string" && data.title ? data.title : slug,
			description: typeof data.description === "string" ? data.description : "",
			date: typeof data.date === "string" ? data.date : "",
			content,
		};
	} catch (error) {
		console.error(`[posts] Failed to parse "${fileName}":`, error);
		return null;
	}
};

const loadPosts = cache((): Post[] => {
	if (!fs.existsSync(postsDirectory)) {
		return [];
	}

	const files = fs
		.readdirSync(postsDirectory)
		.filter((fileName) => fileName.endsWith(".md"));

	return files.map(parsePost).filter((post): post is Post => post !== null);
});

export const getPosts = (): PostMeta[] =>
	loadPosts()
		.map((post) => ({
			slug: post.slug,
			title: post.title,
			description: post.description,
			date: post.date,
		}))
		.sort(byDateDesc);

export const getPostBySlug = (slug: string): Post | null => {
	const post = loadPosts().find((entry) => entry.slug === slug);
	return post ?? null;
};

export const renderMarkdown = async (markdown: string): Promise<string> => {
	if (!markdown) {
		return "";
	}

	try {
		const processed = await markdownProcessor.process(markdown);
		return processed.toString();
	} catch (error) {
		console.error("[posts] Failed to render markdown:", error);
		return `<p><em>Failed to render post content.</em></p>`;
	}
};
