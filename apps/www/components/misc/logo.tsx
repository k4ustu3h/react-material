import React, { JSX } from "react";

const Logo = (props: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
        <path
          d="M20 1.5C30.2173 1.5 38.5 9.78273 38.5 20C38.5 30.2173 30.2173 38.5 20 38.5C9.78273 38.5 1.5 30.2173 1.5 20C1.5 9.78273 9.78273 1.5 20 1.5Z"
          stroke="currentColor"
          strokeWidth="3"
        />
        <rect
          x="7.5"
          y="7.5"
          width="25"
          height="25"
          rx="4.5"
          stroke="currentColor"
          strokeWidth="3"
        />
        <rect
          x="8.12132"
          y="20"
          width="16.799"
          height="16.799"
          rx="4.5"
          transform="rotate(-45 8.12132 20)"
          stroke="currentColor"
          strokeWidth="3"
        />
    </svg>
  );
};

export default Logo;
