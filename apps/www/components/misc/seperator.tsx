import React, { JSX } from "react";

const Seperator = (props: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      aria-hidden="true"
      width="100%"
      height="8"
      fill="none"
      {...props}
      xmlns="http://www.w3.org/2000/svg">
      <pattern id="seperator" width="30" height="8" patternUnits="userSpaceOnUse">
        <g>
          <path
            d="M22.8 4.00001C27.867 -0.666994 32.933 -0.666994 38 4.00001V0H-7.60001V4.00001C-2.53301 -0.666994 2.53301 -0.666994 7.60001 4.00001C12.667 8.66701 17.733 8.66701 22.8 4.00001Z"
            fill="rgb(var(--m3-scheme-surface-dim))"
          />
          <path
            d="M38 4.00001C32.933 -0.666994 27.867 -0.666994 22.8 4.00001C17.733 8.66701 12.667 8.66701 7.60001 4.00001C2.53301 -0.666994 -2.53301 -0.666994 -7.60001 4.00001"
            stroke="rgb(var(--m3-scheme-primary)/0.3)"
            strokeLinecap="square"
          />
        </g>
      </pattern>
      <rect width="100%" height="100%" fill="url(#seperator)"></rect>
    </svg>
  );
};

export default Seperator;
