import React, { useEffect, useRef } from "react";

export const ShapeSoftBoom: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape-soft-boom);"
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
      <clipPath id="m3-shape-soft-boom" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M12.9202 7.37823C14.3077 0.40371 9.69389 0.40371 11.0815 7.37823C9.69389 0.40371 5.43113 2.16902 9.38203 8.08202C5.43113 2.16902 2.16902 5.43113 8.08202 9.38203C2.16902 5.43113 0.40371 9.69389 7.37823 11.0806C0.40371 9.69306 0.40371 14.3069 7.37823 12.9193C0.40371 14.3069 2.16985 18.5688 8.08202 14.6179C2.16985 18.5688 5.43197 21.8309 9.38203 15.9179C5.43113 21.8301 9.69389 23.5954 11.0806 16.6217C9.69306 23.5962 14.3069 23.5962 12.9193 16.6217C14.3069 23.5962 18.5688 21.8301 14.6179 15.9179C18.5688 21.8301 21.8309 18.568 15.9179 14.6179C21.8301 18.5688 23.5954 14.306 16.6217 12.9193C23.5962 14.3069 23.5962 9.69306 16.6217 11.0806C23.5962 9.69306 21.8301 5.43113 15.9179 9.38203C21.8301 5.43113 18.568 2.16902 14.6179 8.08202C18.5688 2.16985 14.306 0.404543 12.9193 7.37823H12.9202Z"
        />
      </clipPath>
    </svg>
  );
};
