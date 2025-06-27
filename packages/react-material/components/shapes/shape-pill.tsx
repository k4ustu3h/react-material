import React, { useEffect, useRef } from "react";

export const ShapePill: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape-pill);"
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
      <clipPath id="m3-shape-pill" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M7.33363 4.53374C10.6839 1.18342 16.1159 1.18342 19.4662 4.53374C22.8165 7.88406 22.8165 13.316 19.4662 16.6663L16.6664 19.4661C13.3161 22.8165 7.88412 22.8165 4.5338 19.4661C1.18348 16.1158 1.18348 10.6839 4.5338 7.33356L7.33363 4.53374Z"
        />
      </clipPath>
    </svg>
  );
};
