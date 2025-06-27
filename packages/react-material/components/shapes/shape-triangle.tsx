import React, { useEffect, useRef } from "react";

export const ShapeTriangle: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape-triangle);"
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
      <clipPath id="m3-shape-triangle" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M8.6186 6.2022C9.57455 4.53607 10.0525 3.703 10.6321 3.35108C11.4725 2.84082 12.5275 2.84082 13.3679 3.35108C13.9475 3.703 14.4255 4.53607 15.3814 6.2022L20.5458 15.2033C21.4926 16.8535 21.966 17.6785 21.9785 18.3527C21.9966 19.3301 21.4705 20.2369 20.6125 20.7072C20.0207 21.0315 19.0686 21.0315 17.1644 21.0315H6.83557C4.93141 21.0315 3.97933 21.0315 3.38754 20.7072C2.52951 20.2369 2.0034 19.3301 2.02151 18.3527C2.034 17.6785 2.50739 16.8535 3.45417 15.2033L8.6186 6.2022Z"
        />
      </clipPath>
    </svg>
  );
};
