import React, { useEffect, useRef } from "react";

export const ShapeSlanted: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape-slanted);"
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
      <clipPath id="m3-shape-slanted" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M2.88725 7.61329C3.04984 6.06095 3.13113 5.28477 3.42964 4.67232C3.86161 3.78607 4.61538 3.10174 5.5344 2.7615C6.16948 2.52637 6.94313 2.52637 8.49043 2.52637H16.3034C18.1746 2.52637 19.1102 2.52637 19.8244 2.83293C20.8586 3.2768 21.6455 4.15897 21.9743 5.24312C22.2015 5.9919 22.1032 6.93055 21.9066 8.80786L21.1128 16.3868C20.9502 17.9392 20.8689 18.7153 20.5704 19.3278C20.1384 20.214 19.3846 20.8984 18.4656 21.2386C17.8305 21.4737 17.0569 21.4737 15.5096 21.4737H7.69664C5.82543 21.4737 4.88983 21.4737 4.17559 21.1672C3.14145 20.7233 2.35455 19.8411 2.02567 18.757C1.79852 18.0082 1.89684 17.0695 2.09346 15.1922L2.88725 7.61329Z"
        />
      </clipPath>
    </svg>
  );
};
