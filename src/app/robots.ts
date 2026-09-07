import type { MetadataRoute } from "next";
import { siteUrl } from "@/content";

const robots = (): MetadataRoute.Robots => {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/"],
			},
		],
		sitemap: `${siteUrl}/sitemap.xml`,
	};
};

export default robots;
