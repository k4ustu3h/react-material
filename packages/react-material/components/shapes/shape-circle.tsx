import React, { useEffect, useRef } from "react";

export const ShapeCircle: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape-circle);"
    );
  }, []);
  return (
    <svg
      ref={shape}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      style={{ position: "absolute", width: 0, height: 0 }}
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <clipPath id="m3-shape-circle" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M22.1052 12C22.1052 17.581 17.581 22.1053 12 22.1053C6.41899 22.1053 1.89471 17.581 1.89471 12C1.89471 6.41906 6.419 1.89477 12 1.89478C17.581 1.89478 22.1052 6.41906 22.1052 12Z"
        />
      </clipPath>
    </svg>
  );
};
