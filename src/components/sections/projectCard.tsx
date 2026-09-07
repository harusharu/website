"use client";

import { ExternalLink, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { FiGithub } from "react-icons/fi";
import Button from "@/components/ui/Button";
import type { ProjectStatus } from "@/content";

interface ProjectCardProps {
	slug: string;
	title: string;
	status: ProjectStatus;
	description: string;
	liveUrl: string;
	githubUrl: string;
	skills: string[];
	previewVideo: string;
}

const statusMeta: Record<
	ProjectStatus,
	{ label: string; dotClassName: string }
> = {
	active: {
		label: "Active",
		dotClassName: "bg-emerald-500",
	},
	building: {
		label: "Building",
		dotClassName: "bg-(--accent)",
	},
	archived: {
		label: "Archived",
		dotClassName: "bg-(--gb-fg2)",
	},
};

const ProjectCard = ({
	slug,
	title,
	status,
	description,
	liveUrl,
	githubUrl,
	skills,
	previewVideo,
}: ProjectCardProps) => {
	const hasPreview = Boolean(previewVideo);
	const projectPagePath = `/projects/${slug}`;
	const statusInfo = statusMeta[status];
	const [showPreview, setShowPreview] = useState(false);
	const previewLabel = showPreview
		? "Close project preview"
		: "Open project preview";

	return (
		<motion.article
			className="project-card relative rounded-xl"
			whileHover={{ y: -2 }}
			transition={{ type: "spring", stiffness: 400, damping: 30 }}
		>
			<Link
				href={projectPagePath}
				aria-label={`Open project details for ${title}`}
				className="absolute inset-0 z-20 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
			/>

			{hasPreview && (
				<div
					className="project-preview-clip relative z-30 overflow-hidden"
					data-open={showPreview ? "true" : "false"}
					aria-hidden={!showPreview}
				>
					<div className="p-2.5">
						<video
							className="w-full rounded-lg"
							loop
							autoPlay
							muted
							playsInline
							controls
							preload="metadata"
						>
							<source src={previewVideo} type="video/mp4" />
							Your browser does not support the video tag.
						</video>
					</div>
				</div>
			)}

			<div className="p-3.5">
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center justify-between">
						<div className="flex min-w-0 items-center gap-2.5">
							<h2 className="truncate text-lg sm:text-xl md:text-2xl font-semibold text-(--gb-fg0)">
								{title}
							</h2>
							<span className="status-tag">
								<span
									aria-hidden="true"
									className={`status-tag-dot ${statusInfo.dotClassName}`}
								/>
								{statusInfo.label}
							</span>
						</div>

						<div className="relative z-30 flex select-none gap-1 sm:gap-2 px-1 sm:px-2 text-base">
							{hasPreview && (
								<Button
									variant="unstyled"
									aria-label={previewLabel}
									aria-pressed={showPreview}
									aria-expanded={showPreview}
									onClick={() => setShowPreview((prev) => !prev)}
									className="project-card-action"
								>
									{showPreview ? <EyeOff /> : <Eye />}
								</Button>
							)}

							{liveUrl && (
								<a
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`Open live project: ${title}`}
									className="project-card-action"
									href={liveUrl}
								>
									<ExternalLink />
								</a>
							)}

							{githubUrl && (
								<a
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`Open GitHub repository for ${title}`}
									className="project-card-action"
									href={githubUrl}
								>
									<FiGithub />
								</a>
							)}
						</div>
					</div>

					<p className="text-(--gb-fg1)">{description}</p>
				</div>
			</div>

			<div className="overflow-hidden">
				<div className="mt-1 flex border-t border-(--gb-border)" />
				<div className="flex items-center px-3.5 py-2.5">
					<ul className="flex flex-wrap gap-1.5 select-none">
						{skills.map((skill) => (
							<li
								key={`${title}-${skill}`}
								className="mono-label list-none rounded-md border border-(--gb-border) px-2 py-1"
							>
								{skill}
							</li>
						))}
					</ul>
				</div>
			</div>
		</motion.article>
	);
};

export default ProjectCard;
