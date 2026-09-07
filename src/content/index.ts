import { Mail } from "lucide-react";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

export type IconComponent = ComponentType<{ className?: string }>;

interface Profile {
	name: string;
	shortName: string;
	bio: string;
	tagline: string;
	introLine: string;
	location: string;
	githubUsername: string;
	twitterHandle: string;
	linkedinSlug: string;
	codeforcesUsername: string;
	calComUsername: string;
	email: string;
	website: string;
	aboutHtml: string;
}

export const profile: Profile = {
	name: "Harshal Sawant",
	shortName: "Harshal",
	bio: "Software Engineer",
	tagline: "Software Engineer — Systems & Backend",
	introLine:
		"I build low-latency backend services and developer tooling in Rust and Go, with a bias for understanding what actually happens under the hood.",
	location: "Mumbai, India",
	githubUsername: "c0d3h01",
	twitterHandle: "haarshalsawant",
	linkedinSlug: "haarshalsawant",
	codeforcesUsername: "c0d3h01",
	calComUsername: "c0d3h01",
	email: "harshalsawant.dev@gmail.com",
	website: "https://harshalsawant.vercel.app",
	aboutHtml: `
		<p>I'm Harshal Sawant, a backend and systems engineer based in Mumbai, India. I got into programming the hard way - through Android rooting, kernel modules, and digging into Linux internals - and never really stopped going deeper.</p>
		<p>Today I build low-latency backend services, distributed systems, and developer tooling, mostly in Rust and Go. I care about things that most people abstract away: scheduler behavior, memory pressure, syscall overhead, and what actually happens under the hood when your system is under load.</p>
	`,
};

/**
 * GitHub serves `<username>.png` with no auth, API call, or quota.
 */
export const profileAvatarUrl = `https://github.com/${profile.githubUsername}.png`;

export const resumeFilePath = "/docs/Harshal_Sawant_Resume.pdf";

const normalizeSiteUrl = (url: string) => url.replace(/\/$/, "");

const isValidAbsoluteUrl = (url: string) => {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
};

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";

export const siteUrl =
	configuredSiteUrl && isValidAbsoluteUrl(configuredSiteUrl)
		? normalizeSiteUrl(configuredSiteUrl)
		: normalizeSiteUrl(profile.website);

const siteTitle = profile.name;
const siteDescription =
	"Portfolio of Harshal Sawant - Software Engineer focused on distributed systems, developer tooling, and high-performance software.";

export const defaultOgImage = "/opengraph-image";

export const seoMetadata: Metadata = {
	title: {
		default: siteTitle,
		template: `%s | ${profile.name}`,
	},
	description: siteDescription,
	authors: [{ name: profile.name }],
	creator: profile.name,
	alternates: {
		canonical: "/",
	},
	metadataBase: new URL(siteUrl),
	icons: {
		icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
		shortcut: [{ url: "/favicon.ico", type: "image/x-icon" }],
	},
	openGraph: {
		title: siteTitle,
		description: siteDescription,
		url: siteUrl,
		siteName: profile.name,
		images: [
			{
				url: defaultOgImage,
				width: 1200,
				height: 630,
				alt: siteTitle,
			},
		],
		locale: "en-IN",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: siteTitle,
		description: siteDescription,
		images: [defaultOgImage],
		creator: `@${profile.twitterHandle}`,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export interface PostMeta {
	slug: string;
	title: string;
	description: string;
	date: string;
}

export type ProjectStatus = "active" | "building" | "archived";

export interface Project {
	slug: string;
	title: string;
	status: ProjectStatus;
	description: string;
	highlights: string[];
	liveUrl: string;
	githubUrl: string;
	techStack: string[];
	bannerImage: string;
	previewVideo: string;
}

export const projects: Project[] = [
	{
		slug: "androidtweaker",
		title: "androidtweaker",
		status: "active",
		description:
			"Built and maintained a shell-driven Android optimization toolkit for rooted devices, focused on runtime tuning, repeatable tweak workflows, and easier long-term maintenance.",
		highlights: [
			"Built a shell-first automation workflow to apply performance tweaks consistently on rooted Android devices.",
			"Added repeatable profiles for CPU, memory, and background-task behavior to reduce manual trial-and-error.",
			"Kept the toolkit modular so tweaks can be added or removed safely during long-term maintenance.",
		],
		liveUrl: "",
		githubUrl: "https://github.com/c0d3h01/androidtweaker",
		techStack: ["Shell", "Android", "Linux", "Performance Tuning"],
		bannerImage: "/images/banners/projects.gif",
		previewVideo: "",
	},
	{
		slug: "coretaskoptimizer",
		title: "coretaskoptimizer",
		status: "active",
		description:
			"Implemented a native C++ root module that applies CPU affinity, scheduler policy, and I/O priority to critical Android system tasks with low-overhead boot-time execution.",
		highlights: [
			"Implemented a native module that applies task scheduling and affinity rules during boot with minimal overhead.",
			"Focused on critical system process prioritization to keep foreground responsiveness stable under load.",
			"Designed the rule pipeline for low-level Linux controls such as scheduler policy and I/O priority.",
		],
		liveUrl: "",
		githubUrl: "https://github.com/c0d3h01/coretaskoptimizer",
		techStack: ["C++", "CMake", "Linux Syscalls", "Kernel Optimization"],
		bannerImage: "/images/banners/projects.gif",
		previewVideo: "",
	},
	{
		slug: "url-shortener",
		title: "shrty",
		status: "building",
		description:
			"A URL shortener with click analytics, geo-IP lookup, and a write-heavy cache layer. Designed to handle viral-link hot-key scenarios without melting Redis.",
		highlights: [
			"REST API in Go (Fiber or Chi) for short-link creation, redirect, and click-event ingestion with rate-limited public endpoints.",
			"Base62 short-code generator with nanoid fallback and collision check against the `links` table before insert.",
			"Postgres schema for links, clicks, and referrers, with partitioning on the clicks table by month to bound retention cost.",
			"Redis cache in front of Postgres for redirect lookups, with jittered TTLs and read-through replicas to absorb hot-link spikes.",
			"Asynchronous click-event ingest path: redirect returns 302 immediately, click is enqueued via Redis Streams and batched into ClickHouse.",
			"Geo-IP resolution via MaxMind GeoLite2 served from a Cloudflare Worker edge cache to keep lookup latency under 5 ms.",
			"Observability with OpenTelemetry traces, Prometheus metrics (`shrty_redirects_total`, `shrty_cache_hit_ratio`), and pprof in non-prod.",
			"Docker Compose stack: app, Postgres 16, Redis 7, ClickHouse, and a seed script that loads 1 M synthetic links for load tests.",
		],
		liveUrl: "",
		githubUrl: "",
		techStack: [
			"Go",
			"Postgres",
			"Redis",
			"ClickHouse",
			"OpenTelemetry",
			"Docker",
			"Cloudflare Workers",
		],
		bannerImage: "/images/banners/projects.gif",
		previewVideo: "",
	},
	{
		slug: "api-gateway-token-bucket",
		title: "ratelock",
		status: "building",
		description:
			"A per-tenant API gateway built around atomic Redis Lua token buckets, plan-aware quotas, per-route cost weights, and standard X-RateLimit response headers.",
		highlights: [
			"Edge gateway in Go using `net/http` reverse proxy mode, terminating TLS and forwarding to upstream service meshes.",
			"Atomic token-bucket implementation in Redis Lua (HSET of tokens + last-refill, EVAL'd per request) to avoid check-then-set races.",
			"Plan-aware quota engine: `free`, `pro`, `enterprise` plans each carry burst capacity, refill rate, and per-route cost weights.",
			"Per-route weight table so cheap routes (`GET /healthz`) cost 0 tokens while expensive routes (`POST /reports`) cost 50 tokens.",
			"Standard response headers on every request: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, plus `Retry-After` on 429.",
			"Tenant identification via JWT claim, API key header, or `X-Tenant-Id` for service-to-service traffic, all validated against a Redis cache.",
			"`GET /v1/me/limits` debug endpoint that returns current bucket state, plan tier, and refill schedule for the calling tenant.",
			"Load-tested with k6 against 1k simulated tenants, including one noisy neighbor scenario to validate isolation.",
		],
		liveUrl: "",
		githubUrl: "",
		techStack: [
			"Go",
			"Redis",
			"Lua",
			"Postgres",
			"k6",
			"OpenTelemetry",
			"Docker",
		],
		bannerImage: "/images/banners/projects.gif",
		previewVideo: "",
	},
	// ponytail: dead project drafts were pruned; revive from git history when one ships.
];

export const getProjectBySlug = (slug: string) =>
	projects.find((project) => project.slug === slug);

export interface Experience {
	role: string;
	company: string;
	location: string;
	duration: string;
	isCurrent: boolean;
	highlights: string[];
}

export const experiences: Experience[] = [
	{
		role: "Software Engineer",
		company: "Freelance",
		location: "Remote",
		duration: "2024 - Present",
		isCurrent: true,
		highlights: [
			"Built backend services in Rust using Actix Web, focused on fast and reliable requests.",
			"Built REST APIs and backends, handling routing, auth, validation, and errors.",
			"Used PostgreSQL, Redis, Docker, and CI/CD to keep services stable and easy to maintain.",
		],
	},
];

interface SocialLink {
	name: string;
	href: string;
	icon: IconComponent;
}

export const SocialLinks: SocialLink[] = [
	{
		name: "Email",
		href: `mailto:${profile.email}`,
		icon: Mail,
	},
	{
		name: "GitHub",
		href: `https://github.com/${profile.githubUsername}`,
		icon: FaGithub,
	},
	{
		name: "X (Twitter)",
		href: `https://x.com/intent/follow?screen_name=${profile.twitterHandle}`,
		icon: FaXTwitter,
	},
	{
		name: "LinkedIn",
		href: `https://www.linkedin.com/in/${profile.linkedinSlug}`,
		icon: FaLinkedinIn,
	},
];
