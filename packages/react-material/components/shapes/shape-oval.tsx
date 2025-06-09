import React, { useEffect, useRef } from "react";

export const ShapeOval: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape-oval);"
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
      <clipPath id="m3-shape-oval" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M17.1353 17.1354C12.7393 21.5314 6.8764 22.796 4.04024 19.9598C1.20408 17.1236 2.46862 11.2608 6.86467 6.86473C11.2607 2.46868 17.1236 1.20414 19.9597 4.0403C22.7959 6.87646 21.5314 12.7393 17.1353 17.1354Z"
        />
      </clipPath>
    </svg>
  );
};
