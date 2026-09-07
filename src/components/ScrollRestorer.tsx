"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Next's scrollRestoration only covers browser back/forward — this also covers
// in-app link clicks. Double RAF on restore: route content mounts async.
const ScrollRestorer = () => {
	const pathname = usePathname();
	const lastPathRef = useRef<string | null>(null);
	const restoredRef = useRef(false);

	useEffect(() => {
		if (lastPathRef.current === pathname) return;

		if (lastPathRef.current) {
			try {
				sessionStorage.setItem(
					`scroll:${lastPathRef.current}`,
					String(window.scrollY),
				);
			} catch {
				// sessionStorage unavailable (private mode, quota); skip silently.
			}
		}

		lastPathRef.current = pathname;
		restoredRef.current = false;
	}, [pathname]);

	// Restore needs two RAFs: content mounts after the pathname effect fires.
	useEffect(() => {
		if (restoredRef.current) return;

		let saved: number | null = null;
		try {
			const raw = sessionStorage.getItem(`scroll:${pathname}`);
			if (raw !== null) saved = Number.parseInt(raw, 10);
		} catch {
			// ignore
		}

		// No saved value — first visit, keep the browser default.
		if (saved === null || Number.isNaN(saved)) {
			restoredRef.current = true;
			return;
		}

		const raf = requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				window.scrollTo({ top: saved as number, behavior: "instant" });
				restoredRef.current = true;
			});
		});

		return () => cancelAnimationFrame(raf);
	}, [pathname]);

	// Re-save on hide in case the tab closes mid-session.
	useEffect(() => {
		const save = () => {
			try {
				sessionStorage.setItem(`scroll:${pathname}`, String(window.scrollY));
			} catch {
				// ignore
			}
		};
		window.addEventListener("pagehide", save);
		return () => window.removeEventListener("pagehide", save);
	}, [pathname]);

	return null;
};

export default ScrollRestorer;
