import React, { useEffect, useRef } from "react";

export const ShapeArch: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape-arch);"
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
      <clipPath id="m3-shape-arch" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M21.7895 18.5512C21.7895 18.9449 21.7895 19.1417 21.7698 19.3071C21.6164 20.5984 20.5983 21.6164 19.3071 21.7699C19.1416 21.7895 18.9448 21.7895 18.5512 21.7895H5.44883C5.05519 21.7895 4.85837 21.7895 4.6929 21.7699C3.40166 21.6164 2.38362 20.5984 2.23019 19.3071C2.21053 19.1417 2.21053 18.9449 2.21053 18.5512L2.21053 12C2.21053 6.59347 6.59342 2.21057 12 2.21057C17.4066 2.21057 21.7895 6.59347 21.7895 12V18.5512Z"
        />
      </clipPath>
    </svg>
  );
};
