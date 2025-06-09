import React from "react";
import "./fab.css";
import { Ripple } from "../misc/ripple";
import mergeProps from "../../utils/merge-props/merge-props";

type CommonProps = {
  color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "primary-container"
    | "secondary-container"
    | "tertiary-container";
  shape?: "round" | "square";
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
};

type Props = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const FAB: React.FC<Props> = (props) => {
  const { color = "primary", shape = "round", size = "small", children, ...extraProps } = props;

  const fontSizeClasses = {
    small: "m3-font-headline-small",
    medium: "m3-font-headline-medium",
    large: "m3-font-display-small",
  };
  const baseClasses = `m3-fab-container ${color} ${shape} ${size} ${fontSizeClasses[size]}`;

  return (
    <button {...mergeProps(extraProps, { className: baseClasses })}>
      <Ripple />
      {children}
    </button>
  );
};
