import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="prose prose-sm sm:prose-lg max-w-none sm:mx-auto overflow-hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={(url) => url}
        components={{
          a: ({ href, children }) => (
            <a
              href={href as string}
              className="text-primary hover:underline break-words"
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),
          h1: ({ children }) => (
            <h1 className="markdown-h1 text-foreground">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="markdown-h2 text-foreground">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="markdown-h3 text-foreground">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="markdown-p text-foreground">{children}</p>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="markdown-code bg-muted px-1.5 py-0.5 rounded">
                  {children}
                </code>
              );
            }
            return <code className={className}>{children}</code>;
          },
          pre: ({ children }) => (
            <pre className="markdown-pre bg-muted p-3 sm:p-4 rounded-lg overflow-x-auto mb-3 sm:mb-4">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 space-y-2">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
