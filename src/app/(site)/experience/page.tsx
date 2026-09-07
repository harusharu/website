import type { Metadata } from "next";
import ExperienceList from "@/components/sections/experienceList";
import BackLink from "@/components/ui/BackLink";
import SectionHeading from "@/components/ui/SectionHeading";
import { defaultOgImage, experiences } from "@/content";

export const metadata: Metadata = {
	title: "Experience — Software Engineer",
	description:
		"Professional experience of Harshal Sawant — backend services in Rust, REST APIs, PostgreSQL, Redis, Docker, and CI/CD for reliable production systems.",
	alternates: {
		canonical: "/experience",
	},
	openGraph: {
		title: "Experience — Software Engineer | Harshal Sawant",
		description:
			"Professional experience of Harshal Sawant — backend services in Rust, REST APIs, PostgreSQL, Redis, Docker, and CI/CD for reliable production systems.",
		url: "/experience",
		images: [defaultOgImage],
	},
	twitter: {
		card: "summary_large_image",
		title: "Experience — Software Engineer | Harshal Sawant",
		description:
			"Professional experience of Harshal Sawant — backend services in Rust, REST APIs, PostgreSQL, Redis, Docker, and CI/CD for reliable production systems.",
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
