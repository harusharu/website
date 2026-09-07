import createBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = createBundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
	poweredByHeader: false,
	onDemandEntries: {
		// Reduce memory usage for long-running dev servers
		maxInactiveAge: 60 * 1000,
		pagesBufferLength: 5,
	},
	async redirects() {
		return [
			{
				source: "/resume",
				destination: "/docs/Harshal_Sawant_Resume.pdf",
				permanent: false,
			},
			{
				source: "/blog",
				destination: "/posts",
				permanent: true,
			},
			{
				source: "/blog/:slug",
				destination: "/posts/:slug",
				permanent: true,
			},
		];
	},
	images: {
		formats: ["image/avif", "image/webp"],
		// Lock the image-optimizer allowlist. Next 16 rejects unrestricted qualities
		// by default; we cap to 3 buckets so the optimizer doesn't 400 on a request
		// asking for q=1 or q=100 and burn disk on one-off cached variants.
		qualities: [50, 75, 90],
		minimumCacheTTL: 60 * 60 * 24 * 30,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "github.com",
				pathname: "/*.png",
			},
		],
	},
};

export default withBundleAnalyzer(nextConfig);
