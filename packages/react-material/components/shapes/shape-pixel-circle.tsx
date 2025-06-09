import React, { useEffect, useRef } from "react";

export const ShapePixelCircle: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape-pixel-circle);"
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
      <clipPath id="m3-shape-pixel-circle" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M16.014 2.14734H7.98597V3.4245H5.24912V5.06664H3.60702V7.98594H2.14737V16.014H3.60702V18.9333H5.24912V20.5754H7.98597V21.8526H16.014V20.5754H18.7509V18.9333H20.393V16.014H21.8526V7.98594H20.393V5.06664H18.7509V3.4245H16.014V2.14734Z"
        />
      </clipPath>
    </svg>
  );
};
