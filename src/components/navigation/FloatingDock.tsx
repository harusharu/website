"use client";

import {
	Fingerprint,
	FolderGit2,
	History,
	LayoutDashboard,
	Moon,
	NotebookPen,
	Sun,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { IconComponent } from "@/content";

interface DockRoute {
	href: string;
	label: string;
	icon: IconComponent;
	exact?: boolean;
}

const dockRoutes: DockRoute[] = [
	{ href: "/", label: "Intro", icon: Fingerprint, exact: true },
	{ href: "/home", label: "Home", icon: LayoutDashboard, exact: true },
	{ href: "/experience", label: "Experience", icon: History },
	{ href: "/projects", label: "Projects", icon: FolderGit2 },
	{ href: "/posts", label: "Posts", icon: NotebookPen },
];

const FloatingDock = () => {
	const pathname = usePathname() ?? "/";
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="dock-wrapper">
			<motion.nav
				aria-label="Primary"
				className="dock"
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					type: "spring",
					stiffness: 300,
					damping: 28,
					delay: 0.15,
				}}
			>
				{dockRoutes.map(({ href, label, icon: Icon, exact }) => {
					const active = exact ? pathname === href : pathname.startsWith(href);
					return (
						<Link
							key={href}
							href={href}
							aria-label={label}
							aria-current={active ? "page" : undefined}
							className="dock-item"
							data-active={active ? "true" : "false"}
						>
							<Icon aria-hidden="true" />
							<span className="dock-tooltip">{label}</span>
						</Link>
					);
				})}

				<div className="dock-divider" aria-hidden="true" />

				<button
					type="button"
					className="dock-item"
					aria-label="Toggle color theme"
					onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
				>
					{mounted && theme === "dark" ? (
						<Sun aria-hidden="true" />
					) : (
						<Moon aria-hidden="true" />
					)}
					<span className="dock-tooltip">Theme</span>
				</button>
			</motion.nav>
		</div>
	);
};

export default FloatingDock;
