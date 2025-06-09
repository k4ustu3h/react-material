import React, { JSX } from "react";

const DottedBackground = (props: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <pattern id="DottedBackground" width="27" height="27" patternTransform="scale(0.3)" patternUnits="userSpaceOnUse">
          <rect width="100%" height="100%" fill="none" />
          <path
            fill="none"
            stroke="rgb(var(--m3-scheme-on-surface))"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth=".5"
            d="M6.75 10h13.5M13.5 3.25v13.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#DottedBackground)" />
      
    </svg>
  );
};

export default DottedBackground;
