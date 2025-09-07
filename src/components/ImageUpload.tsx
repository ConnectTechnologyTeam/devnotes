import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageInsert: (imageUrl: string, altText?: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ImageUpload = ({ onImageInsert, className = '', size = 'md' }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    handleImageUpload(file);
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    
    try {
      // Create a preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Convert file to base64 for storage
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Insert the image into the content using base64
      const altText = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
      onImageInsert(base64Image, altText);
      
      toast({
        title: "Image uploaded",
        description: "Image has been inserted into your content.",
      });

      // Clean up preview URL
      URL.revokeObjectURL(preview);
      setPreviewUrl(null);
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleImageUpload(file);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

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
          isUploading ? 'opacity-50' : ''
        } ${size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-32 h-32' : 'w-24 h-24'}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <CardContent className={`text-center ${size === 'sm' ? 'p-2' : size === 'lg' ? 'p-8' : 'p-4'}`}>
          {previewUrl ? (
            <div className={`${size === 'sm' ? 'space-y-1' : 'space-y-4'}`}>
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className={`max-w-full object-cover rounded-lg mx-auto ${
                    size === 'sm' ? 'h-12' : size === 'lg' ? 'h-32' : 'h-24'
                  }`}
                />
                {size !== 'sm' && (
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
              {size !== 'sm' && (
                <p className="text-sm text-muted-foreground">
                  {isUploading ? 'Uploading...' : 'Click to upload a different image'}
                </p>
              )}
            </div>
          ) : (
            <div className={`${size === 'sm' ? 'space-y-1' : 'space-y-4'}`}>
              <div className={`bg-primary/10 rounded-lg flex items-center justify-center mx-auto ${
                size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'
              }`}>
                {isUploading ? (
                  <div className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${
                    size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'
                  }`} />
                ) : (
                  <Upload className={`text-primary ${
                    size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'
                  }`} />
                )}
              </div>
              {size !== 'sm' && (
                <div>
                  <p className="text-sm font-medium">
                    {isUploading ? 'Uploading image...' : 'Upload an image'}
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
