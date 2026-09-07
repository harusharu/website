import { Link as LinkIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FiGithub } from "react-icons/fi";
import BackLink from "@/components/ui/BackLink";
import ButtonLink from "@/components/ui/ButtonLink";
import { defaultOgImage, getProjectBySlug, profile, projects } from "@/content";

type ProjectPageProps = {
	params: Promise<{
		slug: string;
	}>;
};

export const generateStaticParams = () => {
	return projects.map((project) => ({
		slug: project.slug,
	}));
};

export const dynamicParams = false;
export const dynamic = "force-static";

export const generateMetadata = async ({
	params,
}: ProjectPageProps): Promise<Metadata> => {
	const { slug } = await params;
	const project = getProjectBySlug(slug);

	if (!project) {
		return {
			title: "Project Not Found",
		};
	}

	const socialImage = project.bannerImage || defaultOgImage;

	return {
		title: project.title,
		description: project.description,
		alternates: {
			canonical: `/projects/${project.slug}`,
		},
		openGraph: {
			title: project.title,
			description: project.description,
			type: "article",
			url: `/projects/${project.slug}`,
			authors: [profile.name],
			images: [
				{
					url: socialImage,
					width: 1200,
					height: 420,
					alt: `${project.title} banner`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: project.title,
			description: project.description,
			images: [socialImage],
			creator: `@${profile.twitterHandle}`,
		},
	};
};

const ProjectDetailPage = async ({ params }: ProjectPageProps) => {
	const { slug } = await params;
	const project = getProjectBySlug(slug);

	if (!project) {
		notFound();
	}

	return (
		<article className="flex flex-col gap-4">
			<div className="flex items-center justify-between gap-2">
				<h1 className="text-2xl font-bold text-(--gb-fg0)">{project.title}</h1>
				<BackLink href="/projects" label="All projects" />
			</div>

			<div className="overflow-hidden rounded-xl border border-(--gb-border) bg-(--gb-surface)">
				<Image
					src={project.bannerImage}
					alt={`${project.title} banner`}
					width={1200}
					height={420}
					priority
					className="h-auto w-full object-cover"
				/>
			</div>

			<p className="text-(--gb-fg1)">{project.description}</p>

			<div className="flex flex-wrap gap-2">
				{project.liveUrl && (
					<ButtonLink
						href={project.liveUrl}
						ariaLabel={`Open live project: ${project.title}`}
						className="text-sm"
					>
						<LinkIcon />
						Live
					</ButtonLink>
				)}

				{project.githubUrl && (
					<ButtonLink
						href={project.githubUrl}
						ariaLabel={`Open GitHub repository for ${project.title}`}
						className="text-sm"
					>
						<FiGithub />
						GitHub
					</ButtonLink>
				)}
			</div>

			{project.highlights.length > 0 && (
				<section className="flex flex-col gap-2">
					<h2 className="text-lg font-semibold text-(--gb-fg0)">Highlights</h2>
					<ul className="flex flex-col gap-1.5 text-(--gb-fg1)">
						{project.highlights.map((highlight) => (
							<li
								key={`${project.slug}-highlight-${highlight}`}
								className="flex gap-2"
							>
								<span
									aria-hidden="true"
									className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-(--gb-fg2)"
								/>
								<span>{highlight}</span>
							</li>
						))}
					</ul>
				</section>
			)}

			<section className="flex flex-col gap-2">
				<h2 className="text-lg font-semibold text-(--gb-fg0)">Tech Stack</h2>
				<ul className="flex flex-wrap gap-1.5 select-none">
					{project.techStack.map((tech) => (
						<li
							key={`${project.slug}-${tech}`}
							className="mono-label list-none rounded-md border border-(--gb-border) px-2 py-1"
						>
							{tech}
						</li>
					))}
				</ul>
			</section>

			{project.previewVideo && (
				<section className="flex flex-col gap-2">
					<h2 className="text-lg font-semibold text-(--gb-fg0)">Preview</h2>
					<video
						className="w-full rounded-xl border border-(--gb-border)"
						loop
						autoPlay
						muted
						playsInline
						controls
						preload="metadata"
					>
						<source src={project.previewVideo} type="video/mp4" />
						Your browser does not support the video tag.
					</video>
				</section>
			)}
		</article>
	);
};

export default ProjectDetailPage;
