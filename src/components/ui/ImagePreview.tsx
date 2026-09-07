"use client";

import dynamic from "next/dynamic";
import type { ImageProps } from "next/image";
import { type ReactNode, useState } from "react";
import Button from "@/components/ui/Button";

const ImagePreviewDialog = dynamic(
	() => import("@/components/ui/ImagePreviewDialog"),
	{ ssr: false },
);

interface ImagePreviewProps {
	src: ImageProps["src"];
	alt: string;
	trigger: ReactNode;
	previewAlt?: string;
	dialogLabel?: string;
	triggerAriaLabel?: string;
}

const ImagePreview = ({
	src,
	alt,
	trigger,
	previewAlt,
	dialogLabel,
	triggerAriaLabel = "Open image preview",
}: ImagePreviewProps) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				variant="unstyled"
				aria-label={triggerAriaLabel}
				onClick={() => setIsOpen(true)}
				className="cursor-pointer select-none"
			>
				{trigger}
			</Button>

			{isOpen && (
				<ImagePreviewDialog
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					src={src}
					alt={previewAlt ?? alt}
					dialogLabel={dialogLabel}
				/>
			)}
		</>
	);
};

export default ImagePreview;
