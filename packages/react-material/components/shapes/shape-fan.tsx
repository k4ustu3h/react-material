import React, { useEffect, useRef } from "react";

export const ShapeFan: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape-fan);"
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
      <clipPath id="m3-shape-fan" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M2.52631 5.51806C2.52631 5.4125 2.52631 5.35972 2.5277 5.31509C2.57486 3.79565 3.79559 2.57491 5.31503 2.52775C5.35966 2.52637 5.41244 2.52637 5.518 2.52637C6.081 2.52637 6.3625 2.52637 6.60052 2.53375C14.7042 2.78526 21.2148 9.29585 21.4663 17.3995C21.4737 17.6376 21.4737 17.9191 21.4737 18.482C21.4737 18.5876 21.4737 18.6404 21.4723 18.685C21.4251 20.2045 20.2044 21.4252 18.685 21.4724C18.6403 21.4737 18.5876 21.4737 18.482 21.4737H6.78575C5.49879 21.4737 4.8553 21.4737 4.34485 21.2716C3.60598 20.9791 3.02096 20.3941 2.72842 19.6552C2.52631 19.1447 2.52631 18.5013 2.52631 17.2143V5.51806Z"
        />
      </clipPath>
    </svg>
  );
};
