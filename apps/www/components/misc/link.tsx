import NextLink from "next/link";
import React from "react";

interface LinkProps {
  href: string;
  notAsChild?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: any; // Allow any other props
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ notAsChild, href, children, ...props }, ref) => {
    // Default behavior - render as an anchor
    if (!notAsChild) {
      return (
        <NextLink ref={ref} href={href} legacyBehavior passHref {...props}>
          {children}
        </NextLink>
      );
    }

    return (
      <NextLink ref={ref} href={href} {...props}>
        {children}
      </NextLink>
    );
  }
);

Link.displayName = "Link";

export default Link;
