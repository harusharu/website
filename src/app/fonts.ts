import localFont from "next/font/local";

// display:swap avoids invisible text during load; adjustFontFallback plus an
// explicit fallback chain prevent the post-swap layout snap (CLS).
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
