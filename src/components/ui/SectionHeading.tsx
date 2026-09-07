interface SectionHeadingProps {
	title: string;
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const SectionHeading = ({
	title,
	as: HeadingTag = "h2",
}: SectionHeadingProps) => {
	return (
		<div className="flex items-center gap-2.5 border-b border-(--gb-border) pb-2">
			<span
				aria-hidden="true"
				className="h-[0.85em] w-0.75 shrink-0 rounded-full bg-(--accent)"
			/>
			<HeadingTag className="text-[1.22rem] leading-none font-semibold tracking-tight text-(--gb-fg0) md:text-[1.32rem]">
				{title}
			</HeadingTag>
		</div>
	);
};

export default SectionHeading;
