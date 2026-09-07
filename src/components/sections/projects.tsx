"use client";

import ProjectList from "@/components/sections/projectList";
import SectionHeading from "@/components/ui/SectionHeading";
import ViewAllLink from "@/components/ui/ViewAllLink";
import { projects } from "@/content";

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
