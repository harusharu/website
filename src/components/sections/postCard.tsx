"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { memo } from "react";
import { formatDate } from "@/lib/utils";

interface PostCardProps {
	title: string;
	description: string;
	href: string;
	date: string;
}

const PostCard = memo(function PostCard({
	title,
	description,
	href,
	date,
}: PostCardProps) {
	const publishedAt = formatDate(date);

	return (
		<motion.div whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
			<Link href={href} className="post-card group block">
				<div className="flex w-full flex-col gap-1">
					<div className="flex items-baseline justify-between gap-3">
						<h2 className="wrap-break-word text-base sm:text-lg font-semibold text-(--gb-fg0) group-hover:text-(--accent) transition-colors">
							{title}
						</h2>
						<time
							dateTime={date}
							className="mono-label tnum shrink-0 whitespace-nowrap"
						>
							{publishedAt}
						</time>
					</div>
					<p className="wrap-break-word text-(--gb-fg2)">{description}</p>
				</div>
			</Link>
		</motion.div>
	);
});

export default PostCard;
