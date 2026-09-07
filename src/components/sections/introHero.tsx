"use client";

import { ArrowRight } from "lucide-react";
import { motion, type Variants } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import ImagePreview from "@/components/ui/ImagePreview";
import { profile, profileAvatarUrl, SocialLinks } from "@/content";
import { hoverScale, springTransition, tapScale } from "@/lib/utils";

const container: Variants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.09, delayChildren: 0.05 },
	},
};

const item: Variants = {
	hidden: { opacity: 0, y: 14 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: "spring", stiffness: 260, damping: 26 },
	},
};

const IntroHero = () => {
	return (
		<section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-32">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute left-1/2 top-1/2 h-144 w-144 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[110px]"
				style={{
					background:
						"radial-gradient(circle, var(--accent) 0%, transparent 70%)",
				}}
			/>

			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="relative z-10 flex max-w-xl flex-col items-center gap-5 text-center"
			>
				<motion.span variants={item} className="mono-label">
					@{profile.githubUsername} · {profile.location}
				</motion.span>

				<motion.div variants={item}>
					<ImagePreview
						src={profileAvatarUrl}
						alt="Harshal Sawant — Software Engineer"
						previewAlt="Harshal Sawant profile picture preview"
						dialogLabel="Profile picture preview"
						triggerAriaLabel="Open avatar preview"
						trigger={
							<span className="pro-pic-shell relative block size-28 select-none sm:size-32 md:size-36">
								<Image
									src={profileAvatarUrl}
									alt="Harshal Sawant — Software Engineer"
									className="pro-pic block size-full object-cover"
									fill
									priority
									sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, 144px"
								/>
							</span>
						}
					/>
				</motion.div>

				<motion.h1
					variants={item}
					className="text-4xl font-bold tracking-tight text-(--gb-fg0) sm:text-5xl md:text-6xl"
				>
					{profile.name}
				</motion.h1>

				<motion.p
					variants={item}
					className="mono-label text-(--accent) text-[0.8rem] md:text-sm"
				>
					{profile.tagline}
				</motion.p>

				<motion.p
					variants={item}
					className="text-base leading-relaxed text-(--gb-fg1) md:text-lg"
				>
					{profile.introLine}
				</motion.p>

				<motion.div
					variants={item}
					className="flex flex-wrap items-center justify-center gap-2.5 pt-1"
				>
					{SocialLinks.map((link) => (
						<a
							key={link.name}
							href={link.href}
							aria-label={link.name}
							target="_blank"
							rel="noopener noreferrer"
							className="social-link relative flex items-center justify-center overflow-visible rounded-lg border border-(--gb-border) px-2 py-1.5 transition-colors hover:border-(--accent)"
						>
							<link.icon className="social-link-icon size-4 shrink-0" />
							<span className="social-link-tag">{link.name}</span>
						</a>
					))}
				</motion.div>

				<motion.div variants={item}>
					<motion.div
						whileHover={hoverScale}
						whileTap={tapScale}
						transition={springTransition}
					>
						<Link
							href="/home"
							className="group mt-2 inline-flex items-center gap-2 rounded-full bg-(--accent) px-5 py-2.5 text-sm font-medium text-(--accent-contrast) transition-shadow hover:shadow-[0_10px_30px_-10px_var(--accent)]"
						>
							Enter portfolio
							<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
						</Link>
					</motion.div>
				</motion.div>
			</motion.div>
		</section>
	);
};

export default IntroHero;
