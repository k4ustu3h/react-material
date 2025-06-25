import React from "react";
import "./icon.css";
import mergeProps from "../../utils/merge-props/merge-props";

export const Icon = ({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...mergeProps(props, {
        className: "m3-icon material-symbols-rounded",
      })}>
      {children}
    </span>
  );
};
