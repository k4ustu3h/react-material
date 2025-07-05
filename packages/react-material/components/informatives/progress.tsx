import React, { useEffect, useRef, useState } from "react";
import "./progress.css";
import mergeProps from "../../utils/merge-props/merge-props";
import { linear, trackOpacity } from "./_wavy";

type CommonProps = {
  percent: number;
  variant?: "wavy" | "linear";
};

type Props = CommonProps & React.HTMLAttributes<HTMLDivElement>;

export const Progress: React.FC<Props> = (props) => {
  const { variant = "linear", percent, children, ...extraProps } = props;
  const baseClasses = `m3-progress-container`;

  // Accessibility: Warn if progress doesn't have accessible label
  const hasAccessibleLabel = props["aria-label"] || props["aria-labelledby"];
  if (!hasAccessibleLabel) {
    console.warn(
      "Progress component should have either aria-label or aria-labelledby for accessibility"
    );
  }

  const containerRef = useRef<SVGSVGElement>(null);
  const animateRef = useRef<SVGAnimateElement>(null);

  const [time, setTime] = useState<number>(0);
  const [thickness, setThickness] = useState<number>(2);
  const [width, setWidth] = useState<number>(200);
  const [height, setHeight] = useState<number>(6);

  const top = thickness * 0.5;
  const bottom = height - thickness * 0.5;
  const left = thickness * 0.5;
  const right = width - thickness * 0.5;

  const percentX = (percent / 100) * (right - left) + left;

  const getSMILData = (time: number) => {
    let paths: string[] = [];
    for (let x = 0; x <= 1000; x += 1000 / 30) {
      paths.push(linear(top, bottom, left, percentX, time + x));
    }
    return paths.join(";");
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth * 2;
    const height = container.clientHeight * 2;

    setWidth(width);
    setHeight(height);
    setThickness(container.clientHeight);

    container.setAttribute("viewBox", `0 0 ${width} ${height}`);
  }, [containerRef.current]);

  useEffect(() => {
    setTime(performance.now());
  }, []);

  return (
    <svg
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-valuetext={props["aria-valuetext"] || `${percent}% complete`}
      ref={containerRef}
      {...mergeProps(extraProps, { className: baseClasses })}>
      {variant === "wavy" ? (
        <path
          fill="none"
          stroke="rgb(var(--m3-scheme-primary))"
          strokeWidth={thickness}
          strokeLinecap="round">
          <animate
            ref={animateRef}
            attributeName="d"
            dur="1s"
            repeatCount="indefinite"
            values={getSMILData(time)}
          />
        </path>
      ) : (
        <line
          fill="none"
          stroke="rgb(var(--m3-scheme-primary))"
          strokeWidth={thickness}
          strokeLinecap="round"
          x1={percentX}
          y1={height / 2}
          x2={left}
          y2={height / 2}
        />
      )}

      <line
        fill="none"
        stroke="rgb(var(--m3-scheme-secondary-container))"
        strokeWidth={thickness}
        strokeLinecap="round"
        x1={percentX + thickness + 4}
        y1={height / 2}
        x2={right}
        y2={height / 2}
        opacity={trackOpacity(right, percentX + thickness + 4)}
      />
    </svg>
  );
};
