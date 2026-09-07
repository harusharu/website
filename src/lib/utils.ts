import type { Transition, Variants } from "motion/react";

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "short",
	day: "numeric",
	timeZone: "UTC",
});

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "long",
	day: "numeric",
	timeZone: "UTC",
});

export const formatShortDate = (date: string) =>
	shortDateFormatter.format(new Date(date));

export const formatLongDate = (date: string) =>
	longDateFormatter.format(new Date(date));

// ---------------------------------------------------------------------------
// Motion presets — kept exclusively for explicit, user-triggered feedback
// (hover, tap, modal open-close). All passive scroll-reveal and
// mount-time entrance variants have been removed; sections paint instantly.
// Every animated property here is GPU-friendly (transform / opacity).
// ---------------------------------------------------------------------------

/** Snappy spring for interactive feedback (buttons, links, cards).
 *  Tuned for sub-150ms perceived latency on user-driven input. */
export const springTransition: Transition = {
	type: "spring",
	stiffness: 400,
	damping: 30,
};

/** Scale-down feedback for tap/press — pair with `whileTap`. */
export const tapScale = { scale: 0.97 };

/** Subtle scale-up on hover — pair with `whileHover`. */
export const hoverScale = { scale: 1.03 };

/** Modal backdrop fade (opacity only). */
export const backdropVariants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.15 } },
	exit: { opacity: 0, transition: { duration: 0.12 } },
};

/** Modal content scale-up entrance (transform + opacity only). */
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
