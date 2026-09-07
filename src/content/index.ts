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
		"I build backend services and developer tooling in Rust and Go, with a bias for understanding what actually happens under the hood.",
	location: "Mumbai, India",
	githubUsername: "harusharu",
	twitterHandle: "haarshalsawant",
	linkedinSlug: "haarshalsawant",
	codeforcesUsername: "c0d3h01",
	calComUsername: "harshalsawant",
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
    slug: "harustream",
    title: "HaruStream",
    status: "active",
    description:
        "A multi-provider streaming aggregator — browse trending, top-rated, and popular movies/series pulled from 15+ provider sources, with search and a personal library.",
    highlights: [
        "Built as a single Next.js 16 App Router app that fetches directly from 15+ provider channels, avoiding a separate API layer or Node sidecar.",
        "Video playback handled with Vidstack, backed by axios and cheerio for provider data fetching and Zod for validated data shapes.",
        "Architected with an eye toward open-sourcing for external contributors, using JioHotstar's web app as an architecture reference point."
    ],
    liveUrl: "https://harustream.vercel.app/en",
    githubUrl: "https://github.com/harusharu/harustream",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    bannerImage: "/images/banners/projects.gif",
    previewVideo: "",
	},
	{
    slug: "termchat",
    title: "TermChat",
    status: "building",
    description:
        "Real-time group chat in your terminal — a lightweight TCP server broadcasts every message to all connected clients instantly, no accounts required.",
    highlights: [
        "Built a real-time terminal UI chat client in Rust with Ratatui and crossterm, rendering a split-pane layout (chat history, live user list, input box).",
        "Implemented async TCP networking on Tokio with a custom framing codec (tokio-util) for concurrent, many-to-many message broadcasting.",
        "Added structured logging and robust error handling with tracing and anyhow, including a panic hook that restores terminal state on crash."
    ],
    liveUrl: "",
    githubUrl: "https://github.com/harusharu/termchat",
    techStack: ["Rust", "Tokio", "Ratatui"],
    bannerImage: "/images/banners/projects.gif",
    previewVideo: "",
	},
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
		techStack: ["Shell scripts", "Android kernel", "Performance Tuning"],
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
			"Focused on critical system process prioritization to keep foreground responsiveness stable under load.",
			"Designed the rule pipeline for low-level Linux controls such as scheduler policy and I/O priority.",
			"Uses runtime CPU topology detection to pin critical threads on performance versus efficiency cores."
		],
		liveUrl: "",
		githubUrl: "https://github.com/c0d3h01/coretaskoptimizer",
		techStack: ["C++", "Android kernel", "Kernel Optimization", "CPU task priotizer"],
		bannerImage: "/images/banners/projects.gif",
		previewVideo: "",
	},
];

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
		role: "OSS Developer",
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
