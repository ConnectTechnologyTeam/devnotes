import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUpload from './ImageUpload';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eye, Code, Image as ImageIcon, Bold, Italic, Link, List, Quote } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
  className?: string;
}

const MarkdownEditor = ({ 
  value, 
  onChange, 
  placeholder = "Write your content here...", 
  label = "Content",
  rows = 20,
  className = ""
}: MarkdownEditorProps) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Set cursor position
    setTimeout(() => {
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const handleImageInsert = (imageUrl: string, altText?: string) => {
    const markdownImage = `![${altText || 'Image'}](${imageUrl})`;
    insertText(markdownImage);
  };

  const formatButtons = [
    { icon: Bold, action: () => insertText('**', '**'), tooltip: 'Bold' },
    { icon: Italic, action: () => insertText('*', '*'), tooltip: 'Italic' },
    { icon: Link, action: () => insertText('[', '](url)'), tooltip: 'Link' },
    { icon: List, action: () => insertText('- '), tooltip: 'List' },
    { icon: Quote, action: () => insertText('> '), tooltip: 'Quote' },
  ];

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
            className="ml-2"
            size="sm"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'write' | 'preview')}>
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
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {value}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground italic">
                    {placeholder}
                  </p>
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
