import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { siteFontVariables } from "@/app/fonts";
import FloatingDock from "@/components/navigation/FloatingDock";
import { profile, profileAvatarUrl, seoMetadata, siteUrl } from "@/content";
import "./globals.css";

export const metadata: Metadata = seoMetadata;
export const viewport: Viewport = {
	colorScheme: "light dark",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#fdfbf8" },
		{ media: "(prefers-color-scheme: dark)", color: "#14110f" },
	],
};

const personJsonLd = {
	"@context": "https://schema.org",
	"@type": "Person",
	name: profile.name,
	url: siteUrl,
	image: profileAvatarUrl,
	jobTitle: profile.bio,
	email: `mailto:${profile.email}`,
	address: profile.location,
	sameAs: [
		`https://github.com/${profile.githubUsername}`,
		`https://x.com/${profile.twitterHandle}`,
		`https://www.linkedin.com/in/${profile.linkedinSlug}`,
		`https://codeforces.com/profile/${profile.codeforcesUsername}`,
	],
};

// module-level gate keeps the Figma capture script out of prod HTML entirely.
const isDev = process.env.NODE_ENV === "development";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={siteFontVariables} suppressHydrationWarning>
			<head>
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Required pattern for JSON-LD schema injection.
					dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
				/>
				{isDev && (
					<Script
						src="https://mcp.figma.com/mcp/html-to-design/capture.js"
						strategy="lazyOnload"
					/>
				)}
			</head>
			<body className="antialiased">
				<NextThemesProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div aria-hidden="true" className="grain-overlay" />
					<FloatingDock />
					{children}
				</NextThemesProvider>
			</body>
		</html>
	);
}
