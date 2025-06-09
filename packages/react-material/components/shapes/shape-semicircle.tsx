import React, { useEffect, useRef } from "react";

export const ShapeSemicircle: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape-semicircle);"
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
      <clipPath id="m3-shape-semicircle" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M22.1053 16.2266C22.1053 17.3804 21.1699 18.3158 20.016 18.3158L3.98396 18.3158C2.83011 18.3158 1.89473 17.3804 1.89473 16.2266L1.89473 15.7895C1.89473 10.2085 6.41901 5.6842 12 5.6842C17.581 5.6842 22.1053 10.2085 22.1053 15.7895V16.2266Z"
        />
      </clipPath>
    </svg>
  );
};
