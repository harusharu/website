"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { hoverScale, springTransition, tapScale } from "@/lib/utils";

interface ViewAllLinkProps {
	href: string;
	label?: string;
}

const ViewAllLink = ({ href, label = "View all" }: ViewAllLinkProps) => {
	return (
		<motion.div
			whileHover={hoverScale}
			whileTap={tapScale}
			transition={springTransition}
		>
			<Link
				href={href}
				className="showMore-btn group select-none w-full px-2 py-1.5 rounded-lg block"
			>
				<span className="flex items-center justify-center gap-1.5 text-sm font-medium">
					{label}
					<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
				</span>
			</Link>
		</motion.div>
	);
};

export default ViewAllLink;
