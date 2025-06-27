import type { MDXComponents } from "mdx/types";
import { JSX, ReactNode } from "react";
import ShikiHighlighter from "react-shiki/web";
import Bullet from "./components/misc/bullet";

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

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    code: CodeHighlight,
    li: (props: JSX.IntrinsicElements["li"]) => (
      <li className="relative list-none" {...props}>
        <Bullet className="absolute -left-4 top-2.5" />
        {props.children}
      </li>
    ),
    ...components,
  };
}
