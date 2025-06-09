import React, { useEffect, useRef } from "react";

export const ShapePentagon: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape-pentagon);"
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
      <clipPath id="m3-shape-pentagon" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M9.79355 3.12375C11.1217 2.15878 12.9202 2.15878 14.2483 3.12375L20.3953 7.5898C21.7235 8.55476 22.2792 10.2652 21.7719 11.8266L19.424 19.0528C18.9167 20.6141 17.4617 21.6712 15.82 21.6712H8.2219C6.5802 21.6712 5.12521 20.6141 4.6179 19.0528L2.26996 11.8266C1.76264 10.2652 2.3184 8.55476 3.64656 7.58979L9.79355 3.12375Z"
        />
      </clipPath>
    </svg>
  );
};
