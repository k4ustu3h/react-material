import type { MDXComponents } from "mdx/types";
import React, { JSX, ReactNode, useState } from "react";
import ShikiHighlighter from "react-shiki/web";
import Bullet from "./components/misc/bullet";
import { Icon } from "react-material";

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
  const match = className?.match(/language-(\w+)/);
  const language = match ? match[1] : undefined;

  return !inline ? (
    <ShikiHighlighter language={language} theme={"one-dark-pro"} {...props}>
      {String(children)}
    </ShikiHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

// Helper function to generate slugs from text
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
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
    <button
      onClick={copyToClipboard}
      className="p-1 mr-2 rounded-full hover:bg-surface-bright transition-colors opacity-0 group-hover:opacity-100 size-10 inline-flex items-center justify-center cursor-pointer"
      title={copied ? "Copied!" : "Copy link"}
      aria-label={copied ? "Copied!" : "Copy link to this heading"}>
      <Icon className="text-base select-none">{copied ? "check" : "link"}</Icon>
    </button>
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
    ...components,
  };
}
