import React, { JSX } from "react";

const Logo = (props: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <g clipPath="url(#clip0_53379_35514)">
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
      </g>
      <defs>
        <clipPath id="clip0_53379_35514">
          <rect width="49.5356" height="49.5356" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Logo;
