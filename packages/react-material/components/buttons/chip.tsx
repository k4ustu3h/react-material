import React, { useId } from "react";
import "./chip.css";
import mergeProps from "../../utils/merge-props/merge-props";
import { Ripple } from "../misc/ripple";
import { Icon } from "../misc/icon";

type CommonProps = {
  variant?: "input" | "assist" | "general";
  iconLeft?: string;
  iconRight?: string;
  elevated?: boolean;
  clickable?: boolean;
};

type Props = CommonProps & React.LabelHTMLAttributes<HTMLLabelElement>;

export const Chip: React.FC<Props> = (props) => {
  const {
    iconLeft,
    iconRight,
    variant = "input",
    elevated,
    clickable = true,
    children,
    ...extraProps
  } = props;
  const baseClasses = `m3-chip-container ${variant} ${elevated ? "elevated" : ""}`;
  const id = useId();

  // Accessibility: Warn if chip doesn't have accessible label
  const hasAccessibleLabel = children || props["aria-label"];
  if (!hasAccessibleLabel) {
    console.warn(
      "Chip component should have either visible text (children) or aria-label for accessibility"
    );
  }

  return (
    <>
      <label htmlFor={id} {...mergeProps(extraProps, { className: baseClasses })}>
        {clickable && (
          <input
            id={id}
            type="checkbox"
            aria-pressed={props["aria-pressed"]}
            style={{ position: "absolute", left: "-9999px" }}
          />
        )}

        <Ripple />
        {iconLeft && (
          <Icon className="icon-left" aria-hidden>
            {iconLeft}
          </Icon>
        )}
        <span className="m3-font-label-large">{children}</span>
        {iconRight && (
          <Icon className="icon-right" aria-hidden>
            {iconRight}
          </Icon>
        )}
      </label>
    </>
  );
};
