import React, { ImgHTMLAttributes } from "react";

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onFilesChange?: (files: Map<string, File>) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
  className?: string;
}

export interface FormatButton {
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  tooltip: string;
}

export interface ImageComponentProps
  extends ImgHTMLAttributes<HTMLImageElement> {
  uploadedFiles: Map<string, File>;
}
