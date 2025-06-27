import React, { useId } from "react";
import "./switch.css";
import mergeProps from "../../utils/merge-props/merge-props";

type CommonProps = {
  checked?: boolean;
};

type Props = CommonProps & React.HTMLAttributes<HTMLDivElement>;

export const Switch: React.FC<Props> = (props) => {
  const { checked, children, ...extraProps } = props;
  const id = useId();
  const baseClasses = ``;

  return (
    <div className="m3-switch-container">
      <input
        id={id}
        type="checkbox"
        role="switch"
        {...mergeProps(extraProps, { className: baseClasses })}></input>
      <label htmlFor={id} className="handle">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 4.83 13.41 L 9 17.585 L 19.59 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
      </label>
      <label htmlFor={id} className="hover"></label>
    </div>
  );
};
