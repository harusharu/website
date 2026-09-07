import { ImageResponse } from "next/og";
import { profile } from "@/content";

export const runtime = "edge";

export const alt = `${profile.name} — ${profile.bio}`;
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = "image/png";

const OgImage = () => {
	return new ImageResponse(
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				gap: 20,
				width: "100%",
				height: "100%",
				padding: "80px",
				backgroundColor: "#14110f",
				color: "#f5f0e8",
				fontFamily: "system-ui, sans-serif",
			}}
		>
			<div
				style={{
					fontSize: 28,
					letterSpacing: 2,
					textTransform: "uppercase",
					color: "#a8a29e",
				}}
			>
				@{profile.githubUsername} · {profile.location}
			</div>
			<div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1 }}>
				{profile.name}
			</div>
			<div style={{ fontSize: 40, color: "#e2884f" }}>{profile.tagline}</div>
			<div style={{ fontSize: 28, color: "#a8a29e", maxWidth: 900 }}>
				Distributed systems, developer tooling, and high-performance software in
				Rust and Go.
			</div>
		</div>,
		{ ...size },
	);
};

export default OgImage;
