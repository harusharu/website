import type { Metadata } from "next";
import About from "@/components/sections/about";
import Experience from "@/components/sections/experience";
import Footer from "@/components/sections/footer";
import Posts from "@/components/sections/posts";
import ProfileHeader from "@/components/sections/profileHeader";
import Projects from "@/components/sections/projects";
import Reveal from "@/components/ui/Reveal";
import { profile, profileAvatarUrl } from "@/content";

export const metadata: Metadata = {
	title: "Home",
	description:
		"Overview of Harshal Sawant's background, experience, projects, and technical writing.",
	alternates: {
		canonical: "/home",
	},
};
export const revalidate = 300;

const HomePageRoute = () => {
	return (
		<div className="section-stack flex flex-col gap-4">
			<div className="section-profile">
				<ProfileHeader
					userName={profile.name}
					userBio={profile.bio}
					userImage={profileAvatarUrl}
				/>
			</div>
			<Reveal delay={0.1}>
				<About />
			</Reveal>
			<Reveal delay={0.1}>
				<Experience />
			</Reveal>
			<Reveal delay={0.1}>
				<Projects />
			</Reveal>
			<Reveal delay={0.1}>
				<Posts />
			</Reveal>
			<Reveal delay={0.1}>
				<Footer />
			</Reveal>
		</div>
	);
};

export default HomePageRoute;
