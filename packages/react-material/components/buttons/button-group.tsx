import React, { useId } from "react";
import "./button-group.css";
import mergeProps from "../../utils/merge-props/merge-props";
import { Button } from "./button";

type CommonProps = {
  shape?: "round" | "square";
  variant?: "filled" | "tonal" | "outlined";
  children: React.ReactNode;
  mode: "single" | "multiple";
};

type ButtonGroupItemProps = React.InputHTMLAttributes<HTMLInputElement> & {
  buttonProps?: typeof Button extends React.ComponentType<infer P> ? P : never;
  mode?: "single" | "multiple";
  name?: string;
  itemKey?: string;
};

type Props = CommonProps & React.HTMLAttributes<HTMLDivElement>;

export const ButtonGroup: React.FC<Props> = (props) => {
  const { shape = "round", variant = "filled", mode, children, ...extraProps } = props;
  const baseClasses = `m3-button-group-container ${shape} ${variant}`;

  const groupId = useId();

  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child) && child.type === ButtonGroupItem) {
      const typedChild = child as React.ReactElement<ButtonGroupItemProps>;
      return React.cloneElement(typedChild, {
        mode,
        name: groupId,
        itemKey: `${groupId}-item-${index}`,
        buttonProps: {
          variant,
        } as React.ComponentProps<typeof Button>,
      });
    }
    return child;
  });

  // Accessibility: Ensure button group has accessible name
  const accessibilityProps = {
    role: mode === "single" ? "radiogroup" : "group",
    "aria-label": extraProps["aria-label"] || `Button group with ${mode} selection`,
    ...extraProps,
  };

  return (
    <div {...mergeProps(accessibilityProps, { className: baseClasses })}>{enhancedChildren}</div>
  );
};

export const ButtonGroupItem: React.FC<ButtonGroupItemProps> = (props) => {
  const { buttonProps = {}, mode, children, itemKey, ...extraProps } = props;

  const id = itemKey || useId();

  return (
    <React.Fragment>
      <input
        id={id}
        type={mode === "single" ? "radio" : "checkbox"}
        {...extraProps}
        // Accessibility: Hide input visually but keep it accessible
        style={{ position: "absolute", left: "-9999px" }}
      />
      <Button
        {...mergeProps(buttonProps, {
          shape: "square" as "square",
          htmlFor: id,
          // Accessibility: Indicate the button's toggle state
          "aria-pressed": extraProps.checked || extraProps.defaultChecked,
          role: mode === "single" ? "radio" : "checkbox",
        })}>
        {children}
      </Button>
    </React.Fragment>
  );
};
