import React, { ImgHTMLAttributes } from "react";
import { extractPlaceholderId } from "./utils";

interface MarkdownImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  uploadedFiles: Map<string, File>;
}

const MarkdownImage = ({
  src,
  alt,
  uploadedFiles,
  ...props
}: MarkdownImageProps) => {
  const placeholderId = extractPlaceholderId(src || "");

  if (placeholderId) {
    const file = uploadedFiles.get(placeholderId);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      return (
        <img
          {...props}
          src={previewUrl}
          alt={alt}
          className="max-w-full h-auto rounded-lg"
          onLoad={() => URL.revokeObjectURL(previewUrl)}
        />
      );
    }
    // Show placeholder for processing
    return (
      <div className="inline-flex items-center px-2 py-1 bg-muted rounded text-sm text-muted-foreground">
        📷 Image (will be processed on submit)
      </div>
    );
  }

  // Regular image URL
  return (
    <img
      {...props}
      src={src}
      alt={alt}
      className="max-w-full h-auto rounded-lg"
    />
  );
};

export default MarkdownImage;
