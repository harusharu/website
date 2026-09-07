import type { Transition, Variants } from "motion/react";

export const formatDate = (date: string, month: "short" | "long" = "short") =>
	new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month,
		day: "numeric",
		timeZone: "UTC",
	}).format(new Date(date));

// Motion rule: user-triggered feedback only (hover/tap/modal). No scroll
// reveals or mount entrances — sections must paint instantly. GPU props only.
export const springTransition: Transition = {
	type: "spring",
	stiffness: 400,
	damping: 30,
};

export const tapScale = { scale: 0.97 };

export const hoverScale = { scale: 1.03 };

export const backdropVariants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.15 } },
	exit: { opacity: 0, transition: { duration: 0.12 } },
};

export const dialogContentVariants: Variants = {
	hidden: { opacity: 0, scale: 0.92 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { type: "spring", stiffness: 500, damping: 30, mass: 0.6 },
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: { duration: 0.12, ease: "easeIn" },
	},
};
