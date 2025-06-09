import React, { useEffect, useRef } from "react";

export const Shape4SidedCookie: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape4-sided-cookie);"
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
      <clipPath id="m3-shape4-sided-cookie" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M14.5509 3.18775C18.5121 1.46732 22.5326 5.48782 20.8122 9.44909L20.5278 10.104C20.0025 11.3134 20.0025 12.6865 20.5278 13.8959L20.8122 14.5509C22.5326 18.5121 18.5121 22.5326 14.5509 20.8122L13.8959 20.5278C12.6865 20.0025 11.3134 20.0025 10.104 20.5278L9.44909 20.8122C5.48782 22.5326 1.46732 18.5121 3.18775 14.5509L3.47221 13.8959C3.99746 12.6865 3.99746 11.3134 3.4722 10.104L3.18775 9.44909C1.46732 5.48782 5.48782 1.46732 9.44909 3.18775L10.104 3.4722C11.3134 3.99746 12.6865 3.99746 13.8959 3.4722L14.5509 3.18775Z"
        />
      </clipPath>
    </svg>
  );
};
