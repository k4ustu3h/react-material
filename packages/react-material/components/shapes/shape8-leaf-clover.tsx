import React, { useEffect, useRef } from "react";

export const Shape8LeafClover: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape8-leaf-clover);"
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
      <clipPath id="m3-shape8-leaf-clover" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M21.3843 11.9999C23.0165 15.042 21.7833 17.7961 18.6358 18.6355C17.7961 21.7833 15.042 23.0162 11.9999 21.3843C8.95776 23.0165 6.20369 21.7833 5.36427 18.6358C2.21676 17.7961 0.983595 15.042 2.61576 11.9999C0.983595 8.95776 2.21676 6.20369 5.36427 5.36427C6.20369 2.21676 8.95776 0.983595 11.9999 2.61576C15.042 0.983595 17.7961 2.21676 18.6355 5.36427C21.7833 6.20369 23.0162 8.95776 21.3843 11.9999Z"
        />
      </clipPath>
    </svg>
  );
};
