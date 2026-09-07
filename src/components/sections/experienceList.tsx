"use client";

import { motion, type Variants } from "motion/react";
import type { Experience } from "@/content";

const container: Variants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: "spring", stiffness: 300, damping: 24 },
	},
};

interface ExperienceListProps {
	items: Experience[];
}

const ExperienceList = ({ items }: ExperienceListProps) => {
	return (
		<motion.div
			variants={container}
			initial="hidden"
			whileInView="show"
			viewport={{ once: true, margin: "-40px" }}
			className="section-copy flex flex-col gap-3"
		>
			{items.map(
				({ role, company, duration, location, isCurrent, highlights }) => {
					const entryKey = `${role}·${company}`;
					return (
						<motion.article
							variants={itemVariants}
							key={entryKey}
							className="experience-card group relative rounded-xl border border-(--gb-border) bg-(--gb-surface) p-4 pl-5 transition-colors hover:border-(--accent)"
						>
							<span
								aria-hidden="true"
								className="absolute inset-y-4 left-0 w-0.75 rounded-full bg-(--accent) opacity-80"
							/>
							<div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
								<h3 className="min-w-0 text-[1.02rem] font-semibold text-(--gb-fg0)">
									{role} · {company}
								</h3>
								<p className="mono-label tnum shrink-0 whitespace-nowrap">
									{duration}
									{isCurrent && (
										<span className="text-(--accent)"> · active</span>
									)}
								</p>
							</div>
							<p className="text-sm text-(--gb-fg2)">{location}</p>
							<ul className="mt-2.5 flex flex-col gap-1.5 text-[0.95rem] text-(--gb-fg1)">
								{highlights.map((highlight) => (
									<li
										key={`${entryKey}-${highlight}`}
										className="flex gap-2 pl-0"
									>
										<span
											aria-hidden="true"
											className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-(--gb-fg2)"
										/>
										<span>{highlight}</span>
									</li>
								))}
							</ul>
						</motion.article>
					);
				},
			)}
		</motion.div>
	);
};

export default ExperienceList;
