import React, { useEffect, useRef } from "react";

export const Shape6SidedCookie: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape6-sided-cookie);"
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
      <clipPath id="m3-shape6-sided-cookie" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M8.47483 3.44618C10.4385 1.54594 13.5615 1.54594 15.5251 3.44618C16.1259 4.02764 16.8621 4.45138 17.6676 4.67943C20.3001 5.42473 21.8616 8.12115 21.1927 10.7667C20.9881 11.5762 20.9881 12.4237 21.1927 13.2332C21.8616 15.8787 20.3001 18.5752 17.6676 19.3205C16.8621 19.5485 16.1259 19.9723 15.5251 20.5537C13.5615 22.454 10.4385 22.454 8.47483 20.5537C7.87398 19.9723 7.13781 19.5485 6.33229 19.3205C3.69984 18.5752 2.13834 15.8787 2.80717 13.2332C3.01183 12.4237 3.01183 11.5762 2.80717 10.7667C2.13834 8.12115 3.69984 5.42473 6.3323 4.67943C7.13781 4.45138 7.87398 4.02763 8.47483 3.44618Z"
        />
      </clipPath>
    </svg>
  );
};
