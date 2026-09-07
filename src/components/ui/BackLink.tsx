import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BackLinkProps {
	href: string;
	label: string;
}

const BackLink = ({ href, label }: BackLinkProps) => {
	return (
		<Link
			href={href}
			className="text-(--gb-fg2) hover:text-(--accent) inline-flex items-center gap-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
		>
			<ArrowLeft className="size-3.5" aria-hidden="true" />
			{label}
		</Link>
	);
};

export default BackLink;
