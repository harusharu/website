import ButtonLink from "@/components/ui/ButtonLink";
import { SocialLinks } from "@/content";

const Social = () => {
	return (
		<section
			aria-label="Social links"
			className="flex w-full flex-wrap items-center justify-center gap-3 pt-1 sm:w-auto sm:justify-start"
		>
			{SocialLinks.map((link) => (
				<ButtonLink
					key={link.name}
					ariaLabel={link.name}
					href={link.href}
					className="social-link relative overflow-visible px-2 py-1.5"
				>
					<link.icon className="social-link-icon size-4 shrink-0" />
					<span className="social-link-tag">{link.name}</span>
				</ButtonLink>
			))}
		</section>
	);
};

export default Social;
