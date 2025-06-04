"use client"

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { cn } from '~/lib/utils'

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        "prose prose-invert prose-sm max-w-none",
        "prose-headings:text-foreground prose-p:text-muted-foreground",
        "prose-strong:text-foreground prose-em:text-muted-foreground",
        "prose-code:text-purple-400 prose-code:bg-muted/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
        "prose-pre:bg-muted/30 prose-pre:border prose-pre:border-border/50",
        "prose-blockquote:border-l-purple-500 prose-blockquote:text-muted-foreground",
        "prose-ul:text-muted-foreground prose-ol:text-muted-foreground",
        "prose-li:text-muted-foreground prose-li:marker:text-purple-500",
        "prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline",
        "prose-table:border-collapse prose-table:border prose-table:border-border/50",
        "prose-th:border prose-th:border-border/50 prose-th:bg-muted/20 prose-th:p-2",
        "prose-td:border prose-td:border-border/50 prose-td:p-2",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          // Custom heading styling
          h1: ({ children, ...props }) => (
            <h1 className="text-2xl font-bold text-foreground mb-4" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-xl font-semibold text-foreground mb-3 mt-6" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-lg font-medium text-foreground mb-2 mt-4" {...props}>
              {children}
            </h3>
          ),
          // Custom paragraph styling
          p: ({ children, ...props }) => (
            <p className="text-muted-foreground mb-4 leading-relaxed" {...props}>
              {children}
            </p>
          ),
          // Custom list styling
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground mb-4" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="text-muted-foreground" {...props}>
              {children}
            </li>
          ),
          // Custom link styling
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              className="text-purple-400 hover:text-purple-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
          // Custom blockquote styling
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-purple-500 pl-4 italic text-muted-foreground my-4"
              {...props}
            >
              {children}
            </blockquote>
          ),
          // Custom code styling
          code: ({ children, className, ...props }) => {
            // Check if it's an inline code or code block
            const isInline = !className

            if (isInline) {
              return (
                <code
                  className="bg-muted/30 text-purple-400 px-1 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              )
            }

            // For code blocks, keep default styling
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          // Custom pre styling for code blocks
          pre: ({ children, ...props }) => (
            <pre
              className="bg-muted/30 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm my-4"
              {...props}
            >
              {children}
            </pre>
          ),
          // Custom table styling
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table
                className="min-w-full border-collapse border border-border/50 text-sm"
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th
              className="border border-border/50 bg-muted/20 p-2 text-left font-medium text-foreground"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-border/50 p-2 text-muted-foreground" {...props}>
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
} 