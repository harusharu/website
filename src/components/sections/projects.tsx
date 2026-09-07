"use client";

import dynamic from "next/dynamic";
import SectionHeading from "@/components/ui/SectionHeading";
import ViewAllLink from "@/components/ui/ViewAllLink";
import { projects } from "@/content";

// Code-split the project list (motion + react-icons + video element) out of
// the initial client bundle. The placeholder keeps the flex column height
// stable while the dynamic chunk resolves.
const ProjectList = dynamic(() => import("@/components/sections/projectList"), {
	loading: () => (
		<div
			className="flex min-h-64 flex-col gap-2.5 md:gap-3.5 md:min-h-88"
			aria-hidden="true"
		/>
	),
});

const Projects = () => {
	const visibleCount = 2;
	const shouldShowViewAll = projects.length > visibleCount;

	return (
		<section id="projects" className="section-fluid flex flex-col gap-3">
			<SectionHeading title="Projects" />
			<ProjectList items={projects} limit={visibleCount} />
			{shouldShowViewAll && (
				<ViewAllLink href="/projects" label="View all projects" />
			)}
		</section>
	);
};

export default Projects;
