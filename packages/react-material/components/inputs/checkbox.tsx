import React, { useRef } from "react";
import "./checkbox.css";
import mergeProps from "../../utils/merge-props/merge-props";
import { Ripple } from "../misc/ripple";
import { useIsomorphicLayoutEffect } from "../../utils/hooks/use-isomorphic-layout-effect";

type CommonProps = {
  indeterminate?: boolean;
};

type Props = CommonProps & React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox: React.FC<Props> = (props) => {
  const { indeterminate = false, ...extraProps } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (typeof window !== "undefined" && inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const baseClasses = ``;

  return (
    <label className={`m3-checkbox-container`}>
      <Ripple />
      <span className="m3-checkbox-box"></span>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
        {...mergeProps(extraProps, { className: baseClasses })}></input>
    </label>
  );
};
