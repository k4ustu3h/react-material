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

  return (
    <>
      <label htmlFor={id} {...mergeProps(extraProps, { className: baseClasses })}>
        {clickable && <input id={id} type="checkbox" />}

        <Ripple />
        {iconLeft && <Icon className="icon-left">{iconLeft}</Icon>}
        <span className="m3-font-label-large">{children}</span>
        {iconRight && <Icon className="icon-right">{iconRight}</Icon>}
      </label>
    </>
  );
};
