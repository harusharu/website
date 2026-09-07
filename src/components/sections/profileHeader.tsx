import Image, { type ImageProps } from "next/image";
import Social from "@/components/sections/social";
import ImagePreview from "@/components/ui/ImagePreview";

interface ProfileHeaderProps {
	userName: string;
	userBio: string;
	userImage: ImageProps["src"];
}

const ProfileHeader = ({
	userName,
	userBio,
	userImage,
}: ProfileHeaderProps) => {
	const imageAlt = "Harshal Sawant — Software Engineer";

	return (
		<section className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
			<div className="shrink-0">
				<ImagePreview
					src={userImage}
					alt={imageAlt}
					previewAlt={`${imageAlt} Preview`}
					dialogLabel="Profile picture preview"
					triggerAriaLabel="Open avatar preview"
					trigger={
						<span className="pro-pic-shell relative block size-24 sm:size-28 md:size-32 select-none">
							<Image
								src={userImage}
								alt={imageAlt}
								className="pro-pic block size-full object-cover"
								fill
								preload
								placeholder={typeof userImage === "string" ? "empty" : "blur"}
								sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 130px"
							/>
						</span>
					}
				/>
			</div>

			<div className="flex min-w-0 flex-col items-center justify-center gap-2 sm:items-start">
				<div className="flex flex-col gap-1">
					<h1 className="font-bold text-lg sm:text-xl md:text-2xl">
						{userName}
					</h1>
					<p>{userBio}</p>
				</div>
				<Social />
			</div>
		</section>
	);
};

export default ProfileHeader;
