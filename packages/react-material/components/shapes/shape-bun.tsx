import React, { useEffect, useRef } from "react";

export const ShapeBun: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape-bun);"
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
      <clipPath id="m3-shape-bun" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M2.45526 7.15715C2.45526 4.39031 4.69823 2.14734 7.46508 2.14734H16.5349C19.3018 2.14734 21.5447 4.39031 21.5447 7.15715C21.5447 9.43893 20.0193 11.3644 17.9326 11.9694C17.919 11.9734 17.9095 11.9858 17.9095 12C17.9095 12.0141 17.919 12.0266 17.9326 12.0305C20.0193 12.6355 21.5447 14.561 21.5447 16.8428C21.5447 19.6096 19.3018 21.8526 16.5349 21.8526H7.46508C4.69823 21.8526 2.45526 19.6096 2.45526 16.8428C2.45526 14.5759 3.96087 12.6607 6.02665 12.0425C6.04547 12.0369 6.05851 12.0196 6.05851 12C6.05851 11.9803 6.04547 11.963 6.02665 11.9574C3.96087 11.3393 2.45526 9.42404 2.45526 7.15715Z"
        />
      </clipPath>
    </svg>
  );
};
