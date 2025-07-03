import React from "react";
import "./tooltip.css";
import mergeProps from "../../utils/merge-props/merge-props";

type CommonProps = {

};

type Props = CommonProps & React.HTMLAttributes<HTMLDivElement>;

export const Tooltip: React.FC<Props> = (props) => {
  const { children, ...extraProps } = props;
  const baseClasses = `m3-tooltip-container`;

  return (
      <div {...mergeProps(extraProps, { className: baseClasses })}>
        {children}
      </div>
  );
};
