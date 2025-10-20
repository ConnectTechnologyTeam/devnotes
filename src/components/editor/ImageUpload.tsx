import { useState, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  onImageInsert: (imageUrl: string, altText?: string) => void;
  onImageFile?: (file: File, placeholderId: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

type SizeConfig = {
  card: string;
  padding: string;
  icon: string;
  spinner: string;
  uploadIcon: string;
  imageHeight: string;
  spaceY: string;
  showRemoveButton: boolean;
  showText: boolean;
};

const SIZE_CONFIGS: Record<"sm" | "md" | "lg", SizeConfig> = {
  sm: {
    card: "w-16 h-16",
    padding: "p-2",
    icon: "w-8 h-8",
    spinner: "h-4 w-4",
    uploadIcon: "h-4 w-4",
    imageHeight: "h-12",
    spaceY: "space-y-1",
    showRemoveButton: false,
    showText: false,
  },
  md: {
    card: "w-24 h-24",
    padding: "p-4",
    icon: "w-10 h-10",
    spinner: "h-5 w-5",
    uploadIcon: "h-5 w-5",
    imageHeight: "h-24",
    spaceY: "space-y-4",
    showRemoveButton: true,
    showText: true,
  },
  lg: {
    card: "w-32 h-32",
    padding: "p-8",
    icon: "w-12 h-12",
    spinner: "h-6 w-6",
    uploadIcon: "h-6 w-6",
    imageHeight: "h-32",
    spaceY: "space-y-4",
    showRemoveButton: true,
    showText: true,
  },
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DELAY = 500; // ms

const ImageUpload = ({
  onImageInsert,
  onImageFile,
  className = "",
  size = "md",
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sizeConfig = useMemo(() => SIZE_CONFIGS[size], [size]);

  const validateFile = useCallback(
    (file: File): boolean => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (PNG, JPG, GIF, etc.)",
          variant: "destructive",
        });
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return false;
      }

      return true;
    },
    [toast]
  );

  const generatePlaceholderId = useCallback((): string => {
    return `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const extractAltText = useCallback((filename: string): string => {
    return filename.replace(/\.[^/.]+$/, "");
  }, []);

  const handleImageUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);

      let preview: string | null = null;
      try {
        preview = URL.createObjectURL(file);
        setPreviewUrl(preview);

        await new Promise((resolve) => setTimeout(resolve, UPLOAD_DELAY));

        const altText = extractAltText(file.name);

        if (onImageFile) {
          const placeholderId = generatePlaceholderId();
          onImageFile(file, placeholderId);
          onImageInsert(placeholderId, altText);

          toast({
            title: "Image attached",
            description: "Image will be processed when you submit the form.",
          });
        } else {
          const base64Image = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          onImageInsert(base64Image, altText);

          toast({
            title: "Image uploaded",
            description: "Image has been inserted into your content.",
          });
        }
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);

        if (preview) {
          URL.revokeObjectURL(preview);
          setPreviewUrl(null);
        }

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [generatePlaceholderId, extractAltText, onImageFile, onImageInsert, toast]
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !validateFile(file)) return;
      handleImageUpload(file);
    },
    [validateFile, handleImageUpload]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/") && validateFile(file)) {
          handleImageUpload(file);
        }
      }
    },
    [validateFile, handleImageUpload]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemovePreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Card
        className={`border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer ${
          isUploading ? "opacity-50" : ""
        } ${sizeConfig.card}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <CardContent className={`text-center ${sizeConfig.padding}`}>
          {previewUrl ? (
            <div className={sizeConfig.spaceY}>
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className={`max-w-full object-cover rounded-lg mx-auto ${sizeConfig.imageHeight}`}
                />
                {sizeConfig.showRemoveButton && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePreview();
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {sizeConfig.showText && (
                <p className="text-sm text-muted-foreground">
                  {isUploading
                    ? "Uploading..."
                    : "Click to upload a different image"}
                </p>
              )}
            </div>
          ) : (
            <div className={sizeConfig.spaceY}>
              <div
                className={`bg-primary/10 rounded-lg flex items-center justify-center mx-auto ${sizeConfig.icon}`}
              >
                {isUploading ? (
                  <div
                    className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${sizeConfig.spinner}`}
                  />
                ) : (
                  <Upload className={`text-primary ${sizeConfig.uploadIcon}`} />
                )}
              </div>
              {sizeConfig.showText && (
                <div>
                  <p className="text-sm font-medium">
                    {isUploading ? "Uploading image..." : "Upload an image"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Drag and drop or click to select
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUpload;
