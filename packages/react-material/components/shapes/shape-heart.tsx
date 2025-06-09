import React, { useEffect, useRef } from "react";

export const ShapeHeart: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  const shape = useRef<SVGSVGElement>(null);
  useEffect(() => {
    (shape.current?.parentNode as Element | null)?.setAttribute(
      "style",
      "clip-path: url(#m3-shape-heart);"
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
      <clipPath id="m3-shape-heart" clipPathUnits="objectBoundingBox">
        <path
          transform="scale(0.041666666666666664,0.041666666666666664)"
          d="M17.7537 2.97691C16.3856 2.97691 15.165 3.6191 14.3672 4.62301L12 7.23241V7.22395L9.63276 4.61455C8.83498 3.61064 7.61437 2.96844 6.24629 2.96844C3.84303 2.96844 1.89474 4.94943 1.89474 7.3932C1.89474 9.54054 3.68686 11.1455 4.98434 12.6874C6.27724 14.2235 7.56989 15.7594 8.86254 17.2955L11.7645 20.7434C11.8431 20.8367 11.9214 20.9298 12 21.0231V21.0316C12.0786 20.9383 12.1569 20.8452 12.2355 20.7519C13.2027 19.6026 14.17 18.4534 15.1375 17.3039C16.4301 15.7678 17.723 14.232 19.0157 12.6959C20.3132 11.1542 22.1053 9.54924 22.1053 7.40166C22.1053 4.95789 20.157 2.97691 17.7537 2.97691Z"
        />
      </clipPath>
    </svg>
  );
};
