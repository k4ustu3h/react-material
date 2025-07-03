import React, { useEffect, useRef } from "react";

export const ShapeDiamond: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape-diamond);"
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
      <clipPath id="m3-shape-diamond" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M15.6279 19.3567C14.5646 20.7483 14.033 21.4441 13.4189 21.761C12.5295 22.2201 11.4706 22.2201 10.5811 21.761C9.96708 21.4441 9.43542 20.7483 8.37211 19.3567L4.84083 14.7353C4.19408 13.8889 3.87071 13.4657 3.71058 13.0126C3.47896 12.3571 3.47896 11.6429 3.71058 10.9875C3.87071 10.5344 4.19408 10.1112 4.84083 9.26481L8.37211 4.64337C9.43542 3.2518 9.96708 2.55602 10.5811 2.2391C11.4706 1.78 12.5295 1.78 13.4189 2.2391C14.033 2.55602 14.5646 3.2518 15.6279 4.64337L19.1592 9.26481C19.806 10.1112 20.1293 10.5344 20.2895 10.9875C20.5211 11.6429 20.5211 12.3571 20.2895 13.0126C20.1293 13.4657 19.806 13.8889 19.1592 14.7353L15.6279 19.3567Z"
        />
      </clipPath>
    </svg>
  );
};
