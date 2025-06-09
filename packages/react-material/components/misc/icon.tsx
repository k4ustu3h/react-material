import React from "react";
import "./icon.css";

export const Icon = ({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={`m3-icon material-symbols-rounded ${props.className}`}>
      {children}
    </span>
  );
};
