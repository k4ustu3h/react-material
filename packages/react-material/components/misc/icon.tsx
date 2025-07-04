import React from "react";
import "./icon.css";
import mergeProps from "../../utils/merge-props/merge-props";
export type IconVariant = "outlined" | "rounded" | "sharp";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: IconVariant;
  size?: number | string;
  fill?: boolean;
  weight?: number;
}

export const Icon: React.FC<IconProps> = ({
  children,
  variant = "rounded",
  size,
  fill = false,
  weight = 400,
  style,
  ...props
}) => {
  const iconStyle = {
    fontSize: size ? (typeof size === "number" ? `${size}px` : size) : undefined,
    fontWeight: weight,
    fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}`,
    ...style,
  };

  return (
    <span
      {...mergeProps(props, {
        className: `m3-icon material-symbols-${variant}`,
        style: iconStyle,
      })}
      role="img"
      aria-hidden="true">
      {children}
    </span>
  );
};
