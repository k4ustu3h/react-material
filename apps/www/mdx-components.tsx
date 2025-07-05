import type { MDXComponents } from "mdx/types";
import React, { JSX, ReactNode, useState, useEffect, useRef } from "react";
import ShikiHighlighter from "react-shiki/web";
import Bullet from "./components/misc/bullet";
import { Button, Icon } from "react-material";

interface CodeHighlightProps {
  inline?: boolean | undefined;
  className?: string | undefined;
  children?: ReactNode | undefined;
  node?: Element | undefined;
}

const CodeHighlight = ({
  inline,
  className,
  children,
  node,
  ...props
}: CodeHighlightProps): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed
  const [needsCollapse, setNeedsCollapse] = useState(false); // Track if collapse is needed
  const [copied, setCopied] = useState(false); // Track copy state
  const [contentHeight, setContentHeight] = useState<number>(0); // Track actual content height
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const match = className?.match(/language-(\w+)/);
  const language = match ? match[1] : undefined;

  useEffect(() => {
    const loadCodeHighlight = async () => {
      if (inline) {
        setIsVisible(true);
        setIsLoaded(true);
        return;
      }

      // Wait for DOM to be ready
      await new Promise((resolve) => {
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", resolve);
        } else {
          resolve(true);
        }
      });

      // Set up intersection observer for lazy loading
      const observer = new IntersectionObserver(
        async (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !isVisible) {
              setIsVisible(true);

              // Add a small delay for smooth rendering
              await new Promise((resolve) => setTimeout(resolve, 100));
              setIsLoaded(true);

              // Check if content needs collapse after a small delay
              setTimeout(() => {
                if (contentRef.current) {
                  const scrollHeight = contentRef.current.scrollHeight;
                  const maxHeight = 20 * 16; // 20rem in pixels (assuming 16px base font)
                  setContentHeight(scrollHeight);
                  setNeedsCollapse(scrollHeight > maxHeight);
                  if (scrollHeight <= maxHeight) {
                    setIsCollapsed(false); // Don't collapse if content is small
                  }
                }
              }, 50);

              observer.disconnect();
              break;
            }
          }
        },
        {
          rootMargin: "100px 0px",
          threshold: 0.1,
        }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    };

    const cleanup = loadCodeHighlight();
    return () => {
      cleanup.then((cleanupFn) => cleanupFn && cleanupFn());
    };
  }, [inline, isVisible]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(String(children));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  return !inline ? (
    <div
      ref={containerRef}
      className={`relative transition-all duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      {/* Action buttons */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        {/* Copy button */}
        <Button
          variant="text"
          className="size-8 p-0 bg-surface-container/75"
          onClick={copyToClipboard}
          title={copied ? "Copied!" : "Copy code"}
          aria-label={copied ? "Copied!" : "Copy code to clipboard"}>
          <Icon size={16}>{copied ? "check" : "content_copy"}</Icon>
        </Button>

        {/* Collapse Button - only show if content needs collapse */}
        {needsCollapse && (
          <Button
            variant="text"
            className="size-8 p-0 bg-surface-container/75"
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand code" : "Collapse code"}
            aria-label={isCollapsed ? "Expand code" : "Collapse code"}>
            <Icon size={16}>{isCollapsed ? "expand_more" : "expand_less"}</Icon>
          </Button>
        )}
      </div>

      {/* Code content */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          height:
            needsCollapse && isCollapsed
              ? "20rem"
              : contentHeight > 0
                ? `${contentHeight}px`
                : "auto",
          maskImage:
            needsCollapse && isCollapsed
              ? "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)"
              : "none",
        }}>
        {isVisible && (
          <ShikiHighlighter
            showLanguage={false}
            language={language}
            theme={"one-dark-pro"}
            {...props}>
            {String(children)}
          </ShikiHighlighter>
        )}
      </div>

      {/* Collapsed state overlay - only show if content needs collapse and is collapsed */}
      {needsCollapse && isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface-container to-transparent pointer-events-none" />
      )}
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

// Helper function to generate slugs from text
const slugRegistry = new Map<string, number>();

const generateSlug = (text: string): string => {
  const baseSlug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  // Check if this slug already exists
  const existingCount = slugRegistry.get(baseSlug) || 0;

  // Update the counter for this slug
  slugRegistry.set(baseSlug, existingCount + 1);

  // If it's the first occurrence, use the base slug without any number
  if (existingCount <= 1) {
    return baseSlug;
  }

  // If it's a duplicate, append the counter (starting from 1 for the second occurrence)
  return `${baseSlug}-${existingCount}`;
};

// Copy to clipboard component
const CopyLinkButton = ({ slug }: { slug: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Button
      variant="text"
      className="size-10 p-1 mr-2 hover:bg-surface-container opacity-0 group-hover:opacity-100"
      onClick={copyToClipboard}
      title={copied ? "Copied!" : "Copy link"}
      aria-label={copied ? "Copied!" : "Copy link to this heading"}>
      <Icon size={18}>{copied ? "check" : "link"}</Icon>
    </Button>
  );
};

// Heading component factory
const createHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const HeadingComponent = (props: any) => {
    const { children, id, className, ...restProps } = props;
    const textContent =
      typeof children === "string"
        ? children
        : React.Children.toArray(children)
            .filter((child) => typeof child === "string")
            .join("");

    const slug = id || generateSlug(textContent);
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    return (
      <Tag
        id={slug}
        className={`group scroll-mt-20 flex items-center -ml-12 ${className || ""}`}
        {...restProps}>
        <CopyLinkButton slug={slug} />
        <a href={`#${slug}`} className="no-underline">
          {children}
        </a>
      </Tag>
    );
  };

  HeadingComponent.displayName = `H${level}`;
  return HeadingComponent;
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    code: CodeHighlight,
    h1: createHeading(1),
    h2: createHeading(2),
    h3: createHeading(3),
    h4: createHeading(4),
    h5: createHeading(5),
    h6: createHeading(6),
    table: (props: JSX.IntrinsicElements["table"]) => (
      <div className="bg-surface-container p-8 rounded-md">
        <table className="w-full" {...props} />
      </div>
    ),
    li: (props: JSX.IntrinsicElements["li"]) => (
      <li className="relative list-none" {...props}>
        <Bullet className="absolute -left-4 top-2.5" />
        {props.children}
      </li>
    ),
    wrapper: ({ children }: { children: ReactNode }) => <>{children}</>,
    ...components,
  };
}
