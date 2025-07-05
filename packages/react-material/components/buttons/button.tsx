// Button.tsx
import React from "react";
import "./button.css"; // Assuming you'll name the SCSS file Button.scss
import { Ripple } from "../misc/ripple";
import mergeProps from "../../utils/merge-props/merge-props";

type CommonProps = {
  variant?: "elevated" | "filled" | "tonal" | "outlined" | "text";
  shape?: "round" | "square";
  size?: "extrasmall" | "small" | "medium" | "large" | "extralarge";
  ripple?: boolean;
  children: React.ReactNode;
};

type ButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

type AnchorProps = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

type LabelProps = CommonProps & React.LabelHTMLAttributes<HTMLLabelElement>;

type Props = ButtonProps | AnchorProps | LabelProps;

export const Button: React.FC<Props> = (props) => {
  const {
    ripple = true,
    variant = "filled",
    shape = "round",
    size = "small",
    children,
    ...extraProps
  } = props;

  const fontSizeClasses = {
    extrasmall: "m3-font-label-medium",
    small: "m3-font-label-large",
    medium: "m3-font-title-medium",
    large: "m3-font-headline-small",
    extralarge: "m3-font-headline-large",
  };
  const baseClasses = `m3-button-container ${variant} ${shape} ${size} ${fontSizeClasses[size]}`;

  // Accessibility: Ensure button has accessible text
  const hasAccessibleText = children || props["aria-label"];
  if (!hasAccessibleText) {
    console.warn(
      "Button component should have either visible text (children) or aria-label for accessibility"
    );
  }

  if ("htmlFor" in props) {
    return (
      <label {...mergeProps(extraProps as LabelProps, { className: baseClasses })}>
        {ripple && <Ripple />}
        {children}
      </label>
    );
  } else if ("href" in props) {
    const linkProps = mergeProps(extraProps as AnchorProps, {
      className: baseClasses,
      // Accessibility: External links should indicate they open in new tab
      ...(props.target === "_blank" &&
        !props["aria-label"] && {
          "aria-label": `${children} (opens in new tab)`,
        }),
    });
    return (
      <a {...linkProps}>
        {ripple && <Ripple />}
        {children}
      </a>
    );
  } else {
    return (
      <button {...mergeProps(extraProps, { className: baseClasses })}>
        {ripple && <Ripple />}
        {children}
      </button>
    );
  }
};
