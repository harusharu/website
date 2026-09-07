import localFont from "next/font/local";

// `display: "swap"` keeps text visible during font load (no FOIT).
// `adjustFontFallback` lets Next.js size-adjust the named fallback to the
// target font's x-height/cap-height metrics, eliminating the post-swap
// layout snap that drives Cumulative Layout Shift on slow connections.
// Explicit `fallback` provides the visible fallback chain before swap.

const bodyFont = localFont({
	src: [
		{
			path: "../../public/fonts/inter/inter-latin-wght-normal.woff2",
			style: "normal",
			weight: "100 900",
		},
	],
	display: "swap",
	preload: true,
	variable: "--font-inter-local",
	fallback: ["system-ui", "Arial", "sans-serif"],
	adjustFontFallback: "Arial",
});

const displayFont = localFont({
	src: [
		{
			path: "../../public/fonts/space-grotesk/space-grotesk-latin-wght-normal.woff2",
			style: "normal",
			weight: "300 700",
		},
	],
	display: "swap",
	preload: true,
	variable: "--font-space-grotesk-local",
	fallback: ["system-ui", "Arial", "sans-serif"],
	adjustFontFallback: "Arial",
});

const monoFont = localFont({
	src: [
		{
			path: "../../public/fonts/jetbrains-mono/jetbrains-mono-latin-wght-normal.woff2",
			style: "normal",
			weight: "100 800",
		},
		{
			path: "../../public/fonts/jetbrains-mono/jetbrains-mono-latin-wght-italic.woff2",
			style: "italic",
			weight: "100 800",
		},
	],
	display: "swap",
	preload: false,
	variable: "--font-jetbrains-mono-local",
	fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
	adjustFontFallback: "Arial",
});

export const siteFontVariables = `${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`;
