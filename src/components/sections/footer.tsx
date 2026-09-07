import { profile } from "@/content";

const Footer = () => {
	const year = new Date().getFullYear();

	return (
		<footer className="section-static flex items-center justify-between gap-2 border-t border-(--gb-border) pt-3 text-sm">
			<p className="mono-label">
				© {year} {profile.shortName}
			</p>
			<p className="mono-label">{profile.location}</p>
		</footer>
	);
};

export default Footer;
