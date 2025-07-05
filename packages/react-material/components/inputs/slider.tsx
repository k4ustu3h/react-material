import React, { useState } from "react";
import "./slider.css";
import mergeProps from "../../utils/merge-props/merge-props";

type CommonProps = {
  min?: number;
  max?: number;
  mode?: "continuous";
  step?: number | "any";
  disabled?: boolean;
  showValue?: boolean;
};

type DiscreteProps = {
  min?: number;
  max?: number;
  mode: "discrete";
  step: number;
  disabled?: boolean;
  showValue?: boolean;
};

type Props = (CommonProps | DiscreteProps) & React.InputHTMLAttributes<HTMLInputElement>;

export const Slider: React.FC<Props> = (props) => {
  const {
    defaultValue,
    min = 0,
    max = 100,
    step = 10,
    mode = "continuous",
    disabled = false,
    showValue = true,
    children,
    ...extraProps
  } = props;
  const [value, setValue] = useState<number>(Number(defaultValue) || min);

  const baseClasses = ``;

  // Accessibility: Warn if slider doesn't have accessible label
  const hasAccessibleLabel = props["aria-label"] || props["aria-labelledby"];
  if (!hasAccessibleLabel) {
    console.warn(
      "Slider component should have either aria-label or aria-labelledby for accessibility"
    );
  }

  const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.currentTarget.value);
    setValue(newValue);
  };

  const range = max - min;

  const percent = value !== undefined ? (value - min) / range : 0;

  const ticks = () => {
    const ticksList = [];
    for (let i = 0; i <= range; i += Number(step)) {
      ticksList.push((i / range) * 100);
    }
    return ticksList;
  };

  return (
    <div
      className="m3-slider-container"
      style={{ "--percent": `${percent * 100}%` } as React.CSSProperties}>
      <input
        type="range"
        onInput={updateValue}
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={props["aria-valuetext"] || `${value} out of ${max}`}
        {...mergeProps(extraProps, { className: baseClasses })}
      />
      <div className="track" aria-hidden="true"></div>
      <div className="thumb" aria-hidden="true"></div>
      {mode === "discrete" &&
        ticks().map((tick, index) => (
          <div
            key={index}
            className={`tick 
              ${Math.abs(tick / 100 - value / range) < 0.01 ? "hidden" : ""} ${tick / 100 > value / range ? "inactive" : ""}
            `}
            style={{ "--x": `${tick / 100 - 0.5}` } as React.CSSProperties}
            aria-hidden="true"
          />
        ))}
      {showValue && (
        <div className="value m3-font-label-large" aria-live="polite">
          <span>{value}</span>
        </div>
      )}
    </div>
  );
};
