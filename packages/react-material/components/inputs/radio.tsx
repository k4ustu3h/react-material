import React from "react";
import "./radio.css";
import mergeProps from "../../utils/merge-props/merge-props";
import { Ripple } from "../misc/ripple";

type CommonProps = {};

type Props = CommonProps & React.InputHTMLAttributes<HTMLInputElement>;

export const Radio: React.FC<Props> = (props) => {
  const { children, ...extraProps } = props;
  const baseClasses = ``;

  return (
    <label className="m3-radio-container">
      <Ripple />
      <div className="radio-circle"></div>
      <div className="radio-dot"></div>
      <input type="radio" {...mergeProps(extraProps, { className: baseClasses })}></input>
    </label>
  );
};
