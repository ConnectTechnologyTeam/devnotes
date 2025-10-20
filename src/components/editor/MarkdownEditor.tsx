import { useState, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "./ImageUpload";
import MarkdownImage from "./MarkdownImage";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Eye, Code, Bold, Italic, Link, List, Quote } from "lucide-react";
import { MarkdownEditorProps, FormatButton } from "./types";
import { createUserFriendlyDisplay, convertDisplayToActual } from "./utils";

const MarkdownEditor = ({
  value,
  onChange,
  onFilesChange,
  placeholder = "Write your content here...",
  label = "Content",
  rows = 20,
  className = "",
}: MarkdownEditorProps) => {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [uploadedFiles, setUploadedFiles] = useState<Map<string, File>>(
    new Map()
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Create a user-friendly display value that hides technical placeholder IDs
  const displayValue = useMemo(() => {
    return createUserFriendlyDisplay(value, uploadedFiles);
  }, [value, uploadedFiles]);

  // Helper function to convert display value to actual value
  const convertDisplayToActualValue = useCallback(
    (displayVal: string): string => {
      return convertDisplayToActual(displayVal, uploadedFiles);
    },
    [uploadedFiles]
  );

  // Handle textarea changes while preserving cursor position
  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newDisplayValue = e.target.value;
      const cursorPosition = e.target.selectionStart;

      const actualValue = convertDisplayToActualValue(newDisplayValue);
      onChange(actualValue);

      // Restore cursor position after state update
      setTimeout(() => {
        if (textareaRef.current) {
          const lengthDiff = actualValue.length - newDisplayValue.length;
          const adjustedPosition = Math.max(0, cursorPosition + lengthDiff);
          textareaRef.current.setSelectionRange(
            adjustedPosition,
            adjustedPosition
          );
        }
      }, 0);
    },
    [onChange, convertDisplayToActualValue]
  );

  const insertText = useCallback(
    (before: string, after: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = displayValue.substring(start, end);
      const newDisplayText =
        displayValue.substring(0, start) +
        before +
        selectedText +
        after +
        displayValue.substring(end);

      const actualValue = convertDisplayToActualValue(newDisplayText);
      onChange(actualValue);

      // Set cursor position after state update
      setTimeout(() => {
        const newCursorPos = start + before.length + selectedText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }, 0);
    },
    [displayValue, convertDisplayToActualValue, onChange]
  );

  const handleImageInsert = useCallback(
    (imageUrl: string, altText?: string) => {
      const isAlreadyMarkdown =
        imageUrl.startsWith("![") && imageUrl.includes("](");

      if (isAlreadyMarkdown) {
        insertText(imageUrl);
      } else {
        const markdownImage = `![${altText || "Image"}](${imageUrl})`;
        insertText(markdownImage);
      }
    },
    [insertText]
  );

  const handleImageFile = useCallback(
    (file: File, placeholderId: string) => {
      const newFiles = new Map(uploadedFiles);
      newFiles.set(placeholderId, file);
      setUploadedFiles(newFiles);
      if (onFilesChange) {
        onFilesChange(newFiles);
      }
    },
    [uploadedFiles, onFilesChange]
  );

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as "write" | "preview");
  }, []);

  const formatButtons: FormatButton[] = useMemo(
    () => [
      { icon: Bold, action: () => insertText("**", "**"), tooltip: "Bold" },
      { icon: Italic, action: () => insertText("*", "*"), tooltip: "Italic" },
      { icon: Link, action: () => insertText("[", "](url)"), tooltip: "Link" },
      { icon: List, action: () => insertText("- "), tooltip: "List" },
      { icon: Quote, action: () => insertText("> "), tooltip: "Quote" },
    ],
    [insertText]
  );

  const markdownComponents = useMemo(
    () => ({
      img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
        <MarkdownImage {...props} uploadedFiles={uploadedFiles} />
      ),
    }),
    [uploadedFiles]
  );

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <Label>{label}</Label>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {formatButtons.map(({ icon: Icon, action, tooltip }, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={action}
                title={tooltip}
                className="h-8 w-8 p-0"
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
          <ImageUpload
            onImageInsert={handleImageInsert}
            onImageFile={handleImageFile}
            className="ml-2"
            size="sm"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="write" className="flex items-center space-x-2">
            <Code className="h-4 w-4" />
            <span>Write</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="mt-4">
          <Textarea
            ref={textareaRef}
            value={displayValue}
            onChange={handleTextareaChange}
            placeholder={placeholder}
            rows={rows}
            className="font-mono resize-none"
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="prose prose-lg max-w-none">
                {value ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {value}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground italic">{placeholder}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarkdownEditor;
