import type { Metadata } from "next";
import IntroHero from "@/components/sections/introHero";

export const metadata: Metadata = {
	description:
		"Harshal Sawant — Software Engineer building low-latency backends, distributed systems, and developer tooling in Rust and Go. Enter the portfolio.",
	alternates: {
		canonical: "/",
	},
};

const IntroPageRoute = () => {
	return <IntroHero />;
};

export default IntroPageRoute;
