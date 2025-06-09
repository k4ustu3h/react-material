// Button.tsx
import React from "react";
import "./button.css"; // Assuming you'll name the SCSS file Button.scss
import { Ripple } from "../misc/ripple";
import mergeProps from "../../utils/merge-props/merge-props";

type CommonProps = {
  color?: "elevated" | "filled" | "tonal" | "outlined" | "text";
  shape?: "round" | "square";
  size?: "extrasmall" | "small" | "medium" | "large" | "extralarge";
  children: React.ReactNode;
};

type ButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

type AnchorProps = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

type LabelProps = CommonProps & React.LabelHTMLAttributes<HTMLLabelElement>;

type Props = ButtonProps | AnchorProps | LabelProps;

export const Button: React.FC<Props> = (props) => {
  const { color = "filled", shape = "round", size = "small", children, ...extraProps } = props;

  const fontSizeClasses = {
    extrasmall: "m3-font-label-large",
    small: "m3-font-label-large",
    medium: "m3-font-title-medium",
    large: "m3-font-headline-small",
    extralarge: "m3-font-headline-large",
  };
  const baseClasses = `m3-button-container ${color} ${shape} ${size} ${fontSizeClasses[size]}`;

  if ("htmlFor" in props) {
    return (
      <label {...mergeProps(extraProps as LabelProps, { className: baseClasses })}>
        <Ripple />
        {children}
      </label>
    );
  } else if ("href" in props) {
    return (
      <a {...mergeProps(extraProps as AnchorProps, { className: baseClasses })}>
        <Ripple />
        {children}
      </a>
    );
  } else {
    return (
      <button {...mergeProps(extraProps, { className: baseClasses })}>
        <Ripple />
        {children}
      </button>
    );
  }
};
