import React, { useEffect, useRef } from "react";
import "./checkbox.css";
import mergeProps from "../../utils/merge-props/merge-props";
import { Ripple } from "../misc/ripple";

type CommonProps = {
  indeterminate?: boolean;
};

type Props = CommonProps & React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox: React.FC<Props> = (props) => {
  const { indeterminate = false, ...extraProps } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const baseClasses = ``;

  // Accessibility: Warn if checkbox doesn't have accessible label
  const hasAccessibleLabel = props["aria-label"] || props["aria-labelledby"];
  if (!hasAccessibleLabel) {
    console.warn(
      "Checkbox component should have either aria-label or aria-labelledby for accessibility"
    );
  }

  return (
    <label className={`m3-checkbox-container`}>
      <Ripple />
      <span className="m3-checkbox-box" aria-hidden="true"></span>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {indeterminate ? (
          <path d="M 5 12 H 19" fill="none" stroke="currentColor" strokeWidth="3" />
        ) : (
          <path
            d="M 4.83 13.41 L 9 17.585 L 19.59 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
        )}
      </svg>
      <input
        ref={inputRef}
        type="checkbox"
        {...mergeProps(extraProps, {
          className: baseClasses,
          "aria-checked": indeterminate ? ("mixed" as const) : undefined,
        })}
      />
    </label>
  );
};
