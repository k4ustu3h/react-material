import React, { useEffect, useId, useRef } from "react";
import "./text-field.css";
import mergeProps from "../../utils/merge-props/merge-props";
import { Icon } from "../misc/icon";

type CommonProps = {
  name: string;
  icon?: string;
  variant?: "filled" | "outlined";
  mode?: "singleline" | "multiline";
};

type Props<TMode extends "singleline" | "multiline"> = CommonProps & {
  mode: TMode;
} & (TMode extends "multiline"
    ? React.TextareaHTMLAttributes<HTMLTextAreaElement>
    : React.InputHTMLAttributes<HTMLInputElement>);

export const TextField = <TMode extends "singleline" | "multiline">(props: Props<TMode>) => {
  const {
    variant = "filled",
    mode = "singleline",
    name,
    icon,
    placeholder,
    children,
    ...extraProps
  } = props;
  const baseClasses = `focus-none input`;
  const id = useId();

  if (mode === "multiline") {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
      if (mode === "multiline" && textareaRef.current) {
        const textarea = textareaRef.current;
        const changeHandler = () => {
          (textarea.parentNode as HTMLDivElement).style.height = "0px";
          (textarea.parentNode as HTMLDivElement).style.height = `${textarea.scrollHeight}px`;
        };
        textarea.addEventListener("input", changeHandler);
        return () => {
          textarea.removeEventListener("input", changeHandler);
        };
      }
    }, [textareaRef.current]);
    return (
      <div className={`m3-text-field-container ${mode} ${variant}`}>
        <textarea
          ref={textareaRef}
          placeholder=" "
          id={id}
          name={name}
          {...mergeProps(extraProps, { className: baseClasses })}></textarea>
        <div className="layer"></div>
        <label className="m3-font-body-large" htmlFor={id}>
          {name}
        </label>
        {icon && <Icon className="leading">{icon}</Icon>}
      </div>
    );
  } else if (mode === "singleline") {
    return (
      <div className={`m3-text-field-container ${mode} ${variant}`}>
        <input
          type="text"
          placeholder=" "
          id={id}
          name={name}
          {...mergeProps(extraProps, { className: baseClasses })}></input>
        <div className="layer"></div>
        <label className="m3-font-body-large" htmlFor={id}>
          {name}
        </label>
        {icon && <Icon className="leading">{icon}</Icon>}
      </div>
    );
  }
};
