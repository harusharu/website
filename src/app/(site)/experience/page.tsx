import type { Metadata } from "next";
import ExperienceList from "@/components/sections/experienceList";
import BackLink from "@/components/ui/BackLink";
import SectionHeading from "@/components/ui/SectionHeading";
import { defaultOgImage, experiences } from "@/content";

export const metadata: Metadata = {
	title: "Experience",
	description: "Professional and freelance experience",
	alternates: {
		canonical: "/experience",
	},
	openGraph: {
		title: "Experience",
		description: "Professional and freelance experience",
		url: "/experience",
		images: [defaultOgImage],
	},
	twitter: {
		card: "summary_large_image",
		title: "Experience",
		description: "Professional and freelance experience",
		images: [defaultOgImage],
	},
};
export const dynamic = "force-static";

const ExperiencePage = () => {
	return (
		<section className="flex flex-col gap-4">
			<div className="flex items-center justify-between gap-2">
				<SectionHeading title="Experience" as="h1" />
				<BackLink href="/home" label="Home" />
			</div>

			<ExperienceList items={experiences} />
		</section>
	);
};

export default ExperiencePage;
