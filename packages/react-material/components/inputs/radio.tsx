import React from "react";
import "./radio.css";
import mergeProps from "../../utils/merge-props/merge-props";
import { Ripple } from "../misc/ripple";

type CommonProps = {};

type Props = CommonProps & React.InputHTMLAttributes<HTMLInputElement>;

export const Radio: React.FC<Props> = (props) => {
  const { children, ...extraProps } = props;
  const baseClasses = ``;

  // Accessibility: Warn if radio doesn't have accessible label
  const hasAccessibleLabel = props["aria-label"] || props["aria-labelledby"];
  if (!hasAccessibleLabel) {
    console.warn(
      "Radio component should have either aria-label or aria-labelledby for accessibility"
    );
  }

  return (
    <label className="m3-radio-container">
      <Ripple />
      <div className="radio-circle" aria-hidden="true"></div>
      <div className="radio-dot" aria-hidden="true"></div>
      <input type="radio" {...mergeProps(extraProps, { className: baseClasses })} />
    </label>
  );
};
