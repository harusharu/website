import type { Metadata } from "next";
import { profile, resumeFilePath, siteUrl } from "@/content";

export const metadata: Metadata = {
	title: "Resume",
	description: `${profile.name} — ${profile.bio}.`,
	openGraph: {
		title: `Resume — ${profile.name}`,
		description: `${profile.name} — ${profile.bio}.`,
		url: `${siteUrl}/resume`,
	},
};

export default function ResumePage() {
	return (
		<iframe
			src={resumeFilePath}
			title={`${profile.name} resume`}
			className="w-full h-dvh border-0"
		/>
	);
}
