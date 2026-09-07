import type { Metadata } from "next";
import ProjectList from "@/components/sections/projectList";
import BackLink from "@/components/ui/BackLink";
import SectionHeading from "@/components/ui/SectionHeading";
import { defaultOgImage, projects } from "@/content";

export const metadata: Metadata = {
	title: "Projects — Systems & Backend Builds",
	description:
		"Systems and backend projects by Harshal Sawant — Android internals, CPU scheduling, URL shortening, and API rate limiting in Go, C++, Shell, and Rust.",
	alternates: {
		canonical: "/projects",
	},
	openGraph: {
		title: "Projects — Systems & Backend Builds | Harshal Sawant",
		description:
			"Systems and backend projects by Harshal Sawant — Android internals, CPU scheduling, URL shortening, and API rate limiting in Go, C++, Shell, and Rust.",
		url: "/projects",
		images: [defaultOgImage],
	},
	twitter: {
		card: "summary_large_image",
		title: "Projects — Systems & Backend Builds | Harshal Sawant",
		description:
			"Systems and backend projects by Harshal Sawant — Android internals, CPU scheduling, URL shortening, and API rate limiting in Go, C++, Shell, and Rust.",
		images: [defaultOgImage],
	},
};
export const dynamic = "force-static";

const ProjectsPage = () => {
	return (
		<section className="flex flex-col gap-4">
			<div className="flex items-center justify-between gap-2">
				<SectionHeading title="Projects" as="h1" />
				<BackLink href="/home" label="Home" />
			</div>

			<ProjectList items={projects} />
		</section>
	);
};

export default ProjectsPage;
