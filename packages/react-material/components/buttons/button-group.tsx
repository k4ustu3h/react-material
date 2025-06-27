import React, { useId } from "react";
import "./button-group.css";
import mergeProps from "../../utils/merge-props/merge-props";
import { Button } from "./button";

type CommonProps = {
  shape?: "round" | "square";
  variant?: "elevated" | "filled" | "tonal" | "outlined";
  children: React.ReactNode;
  mode: "single" | "multiple";
};

type ButtonGroupItemProps = React.InputHTMLAttributes<HTMLInputElement> & {
  buttonProps: typeof Button extends React.ComponentType<infer P> ? P : never;
  mode: "single" | "multiple";
  name?: string;
  itemKey?: string;
};

type Props = CommonProps & React.HTMLAttributes<HTMLDivElement>;

export const ButtonGroup: React.FC<Props> = (props) => {
  const { shape = "round", variant = "filled", mode, children, ...extraProps } = props;
  const baseClasses = `m3-button-group-container ${shape}`;

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

  return <div {...mergeProps(extraProps, { className: baseClasses })}>{enhancedChildren}</div>;
};

export const ButtonGroupItem: React.FC<ButtonGroupItemProps> = (props) => {
  const { buttonProps, mode, children, itemKey, ...extraProps } = props;

  const id = itemKey || useId();

  return (
    <React.Fragment>
      <input id={id} type={mode === "single" ? "radio" : "checkbox"} {...extraProps} />
      <Button {...mergeProps(buttonProps, { shape: "square" as "square", htmlFor: id })}>
        {children}
      </Button>
    </React.Fragment>
  );
};
