import React, { useEffect, useRef } from "react";

export const ShapePixelTriangle: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape-pixel-triangle);"
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
      <clipPath id="m3-shape-pixel-triangle" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M7.68259 1.89471H4.16842V22.1052H7.68259V20.3478H10.3935V18.6782H13.2049V16.745H15.5142V15.1633H17.8235V13.2302H19.8316V10.7698H17.8235V8.83655H15.5142V7.25488H13.2049V5.32172H10.3935V3.65216H7.68259V1.89471Z"
        />
      </clipPath>
    </svg>
  );
};
