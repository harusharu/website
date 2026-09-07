"use client";

export default function PostError({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	return (
		<div className="flex flex-col gap-3 py-12">
			<h1 className="text-xl font-medium text-(--gb-fg0)">
				Something went wrong
			</h1>
			<p className="text-sm text-(--gb-fg2)">{error.message}</p>
			<button
				type="button"
				onClick={reset}
				className="text-(--accent) text-sm underline underline-offset-4 text-left"
			>
				Try again
			</button>
		</div>
	);
}
