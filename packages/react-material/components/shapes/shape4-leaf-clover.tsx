import React, { useEffect, useRef } from "react";

export const Shape4LeafClover: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape4-leaf-clover);"
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
      <clipPath id="m3-shape4-leaf-clover" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M3.96868 12C3.1431 11.0109 2.64575 9.73424 2.64575 8.34056C2.64575 5.19918 5.17256 2.65259 8.28954 2.65259C9.70026 2.65259 10.9901 3.17423 11.9795 4.03657C12.9666 3.17423 14.2534 2.65259 15.6608 2.65259C18.7705 2.65259 21.2914 5.19918 21.2914 8.34056C21.2914 9.73424 20.7952 11.0109 19.9716 12C20.7952 12.9891 21.2914 14.2657 21.2914 15.6593C21.2914 18.8007 18.7705 21.3473 15.6608 21.3473C14.2534 21.3473 12.9666 20.8257 11.9795 19.9633C10.9901 20.8257 9.70026 21.3473 8.28954 21.3473C5.17256 21.3473 2.64575 18.8007 2.64575 15.6594C2.64575 14.2657 3.1431 12.9891 3.96868 12Z"
        />
      </clipPath>
    </svg>
  );
};
