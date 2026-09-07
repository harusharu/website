import type { ReactNode } from "react";

const SiteLayout = ({ children }: { children: ReactNode }) => (
	<div className="mx-auto max-w-3xl px-4 pt-10 pb-28 sm:px-6 sm:pt-14 sm:pb-32 md:pt-20 md:pb-36">
		<main>{children}</main>
	</div>
);

export default SiteLayout;
