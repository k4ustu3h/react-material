import React, { useEffect, useRef } from "react";

export const ShapeSquare: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape-square);"
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
      <clipPath id="m3-shape-square" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M22.1053 12.7579C22.1053 15.5822 22.1053 16.9943 21.6617 18.1145C21.0198 19.736 19.7359 21.0198 18.1145 21.6618C16.9943 22.1053 15.5822 22.1053 12.7579 22.1053H11.2421C8.41786 22.1053 7.00573 22.1053 5.88554 21.6618C4.26408 21.0198 2.98024 19.736 2.33826 18.1145C1.89474 16.9943 1.89474 15.5822 1.89474 12.7579L1.89475 11.2421C1.89475 8.41789 1.89475 7.00576 2.33826 5.88557C2.98024 4.26411 4.26409 2.98027 5.88554 2.33829C7.00573 1.89478 8.41786 1.89478 11.2421 1.89478L12.7579 1.89478C15.5822 1.89478 16.9943 1.89478 18.1145 2.33829C19.7359 2.98027 21.0198 4.26412 21.6618 5.88557C22.1053 7.00576 22.1053 8.41789 22.1053 11.2421V12.7579Z"
        />
      </clipPath>
    </svg>
  );
};
