import React, { useEffect, useRef } from "react";

export const ShapeGhostIsh: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape-ghost-ish);"
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
      <clipPath id="m3-shape-ghost-ish" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M2.52637 11.5489C2.52637 6.5659 6.76788 2.52637 12.0001 2.52637C17.2322 2.52637 21.4737 6.5659 21.4737 11.5489L21.4737 17.8647C21.4737 19.8579 19.7771 21.4737 17.6843 21.4737C17.0639 21.4737 16.4784 21.3318 15.9616 21.0801C15.6982 20.9519 15.4355 20.8113 15.1716 20.6701C14.243 20.1734 13.3006 19.6692 12.2697 19.6692H11.7304C10.6995 19.6692 9.75714 20.1734 8.82852 20.6701C8.56465 20.8113 8.3019 20.9519 8.03854 21.0801C7.52169 21.3318 6.93617 21.4737 6.31584 21.4737C4.22297 21.4737 2.52637 19.8579 2.52637 17.8647L2.52637 11.5489Z"
        />
      </clipPath>
    </svg>
  );
};
