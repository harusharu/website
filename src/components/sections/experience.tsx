import ExperienceList from "@/components/sections/experienceList";
import SectionHeading from "@/components/ui/SectionHeading";
import ViewAllLink from "@/components/ui/ViewAllLink";
import { experiences } from "@/content";

const Experience = () => {
	const visibleExperiences = experiences.slice(0, 1);

	return (
		<section className="section-fluid flex flex-col gap-3">
			<SectionHeading title="Experience" />
			<ExperienceList items={visibleExperiences} />
			{experiences.length > 1 && (
				<ViewAllLink href="/experience" label="View all experience" />
			)}
		</section>
	);
};

export default Experience;
