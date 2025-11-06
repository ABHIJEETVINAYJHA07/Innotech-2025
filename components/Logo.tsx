import React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 200 150"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M35 110 C 35 110, 30 50, 100 50 C 170 50, 165 110, 165 110"
      fill="none"
      stroke="#f472b6"
      strokeWidth="20"
      strokeLinecap="round"
    />
    <path
      d="M45 110 L 25 110 L 25 90 L 45 90 L 45 70 L 65 70 L 65 110 Z"
      fill="#f472b6"
    />
     <path
      d="M155 110 L 175 110 L 175 90 L 155 90 L 155 70 L 135 70 L 135 110 Z"
      fill="#f472b6"
    />
    <g transform="translate(0, 5)">
        <path
            d="M 80 75 H 120 M 80 85 H 120 M 85 75 L 100 95 L 115 75"
            fill="none"
            stroke="#14b8a6"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </g>
  </svg>
);

export default Logo;