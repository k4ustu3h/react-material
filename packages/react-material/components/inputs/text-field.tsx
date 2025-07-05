import React, { useEffect, useId, useRef } from "react";
import "./text-field.css";
import mergeProps from "../../utils/merge-props/merge-props";
import { Icon } from "../misc/icon";

type CommonProps = {
  name: string;
  icon?: string;
  variant?: "filled" | "outlined";
  mode?: "singleline" | "multiline";
  errorMessage?: string;
  helperText?: string;
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
    errorMessage,
    helperText,
    ...extraProps
  } = props;
  const baseClasses = `focus-none input`;
  const id = useId();
  const descriptionId = useId();
  const errorId = useId();

  // Build aria-describedby
  const describedBy = [
    extraProps["aria-describedby"],
    helperText && descriptionId,
    errorMessage && errorId,
  ]
    .filter(Boolean)
    .join(" ");

  const commonInputProps = {
    id,
    name,
    "aria-describedby": describedBy || undefined,
    "aria-invalid": extraProps["aria-invalid"] || !!errorMessage,
    "aria-required": extraProps["aria-required"] || extraProps.required,
    ...extraProps,
    className: baseClasses,
  };

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
        <textarea ref={textareaRef} placeholder=" " {...mergeProps(commonInputProps, {})} />
        <div className="layer"></div>
        <label className="m3-font-body-large" htmlFor={id}>
          {name}
        </label>
        {icon && (
          <Icon className="leading" aria-hidden>
            {icon}
          </Icon>
        )}
        {helperText && (
          <div id={descriptionId} className="helper-text m3-font-body-small">
            {helperText}
          </div>
        )}
        {errorMessage && (
          <div id={errorId} className="error-message m3-font-body-small" role="alert">
            {errorMessage}
          </div>
        )}
      </div>
    );
  } else if (mode === "singleline") {
    return (
      <div className={`m3-text-field-container ${mode} ${variant}`}>
        <input type="text" placeholder=" " {...mergeProps(commonInputProps, {})} />
        <div className="layer"></div>
        <label className="m3-font-body-large" htmlFor={id}>
          {name}
        </label>
        {icon && (
          <Icon className="leading" size={24} aria-hidden>
            {icon}
          </Icon>
        )}
        {helperText && (
          <div id={descriptionId} className="helper-text m3-font-body-small">
            {helperText}
          </div>
        )}
        {errorMessage && (
          <div id={errorId} className="error-message m3-font-body-small" role="alert">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
};
