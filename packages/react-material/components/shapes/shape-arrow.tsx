import React, { useEffect, useRef } from "react";

export const ShapeArrow: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape-arrow);"
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
      <clipPath id="m3-shape-arrow" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M16.574 6.62575C15.9924 5.70281 15.4004 4.76707 14.614 4.0342C13.8276 3.2995 12.8089 2.78046 11.7644 2.84808C10.8472 2.90839 9.99714 3.41647 9.32603 4.07989C8.65492 4.74331 8.13352 5.56026 7.62072 6.36989C6.23375 8.55571 4.84507 10.7415 3.45811 12.9292C2.79904 13.9673 2.12277 15.051 1.94036 16.2883C1.7201 17.7833 2.31377 19.3057 3.3669 20.2999C4.46821 21.3398 6.25268 21.2558 7.59318 20.9707C9.06275 20.6581 10.4996 20.0697 11.9984 20.0715C13.2821 20.0715 14.5228 20.5065 15.7721 20.8226C17.0197 21.137 18.3602 21.3307 19.5648 20.8628C21.0602 20.2835 22.1339 18.6368 22.1047 16.9463C22.0771 15.4038 20.4321 12.7428 20.4321 12.7428C20.4321 12.7428 17.8598 8.66492 16.574 6.62575Z"
        />
      </clipPath>
    </svg>
  );
};
