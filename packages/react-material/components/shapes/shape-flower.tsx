import React, { useEffect, useRef } from "react";

export const ShapeFlower: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape-flower);"
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
      <clipPath id="m3-shape-flower" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M19.1448 4.85445C18.3948 4.10448 16.6859 4.47533 14.624 5.66406C14.0066 3.36538 13.0604 1.89472 11.9998 1.89472C10.9392 1.89472 9.99304 3.36529 9.3756 5.66384C7.31379 4.47523 5.60503 4.10444 4.85509 4.85438C4.10508 5.6044 4.47601 7.31343 5.66492 9.37552C3.36576 9.99295 1.89474 10.9392 1.89474 12C1.89474 13.0606 3.36524 14.0067 5.66371 14.6241C4.47471 16.6863 4.10373 18.3954 4.85377 19.1454C5.60384 19.8955 7.31308 19.5245 9.37539 18.3353C9.99283 20.6343 10.939 22.1052 11.9998 22.1052C13.0605 22.1052 14.0068 20.6343 14.6242 18.3351C16.6866 19.5244 18.396 19.8955 19.1461 19.1454C19.8961 18.3954 19.5252 16.6863 18.3362 14.6241C20.6347 14.0067 22.1053 13.0606 22.1053 12C22.1053 10.9392 20.6342 9.99293 18.335 9.3755C19.5239 7.31345 19.8948 5.60446 19.1448 4.85445Z"
          fill-rule="evenodd"
          clip-rule="evenodd"
        />
      </clipPath>
    </svg>
  );
};
