import React from "react";
import classes from "./Header.module.css";
import iconHeader from "../../../image/iconHeader.svg";

export default function Header() {
  return (
    <div className={classes.header}>
      <div className={classes.icon}>
        <img src={iconHeader} alt="iconHeader" />
      </div>

      <div className={classes.panel}>
        <div className={classes.palkaHeader}>
          <svg
            width="13.333252"
            height="1.333252"
            viewBox="0 0 13.3333 1.33325"
            fill="none"
          >
            <desc>Created with Pixso.</desc>
            <defs />
            <path
              id="Vector"
              d="M12.66 1.33L0.66 1.33C0.48 1.33 0.32 1.26 0.19 1.13C0.07 1.01 0 0.84 0 0.66C0 0.48 0.07 0.32 0.19 0.19C0.32 0.07 0.48 0 0.66 0L12.66 0C12.84 0 13.01 0.07 13.13 0.19C13.26 0.32 13.33 0.48 13.33 0.66C13.33 0.84 13.26 1.01 13.13 1.13C13.01 1.26 12.84 1.33 12.66 1.33Z"
              fill="#3A3A3A"
              fill-opacity="1.000000"
              fill-rule="nonzero"
            />
          </svg>
        </div>
        <div className={classes.kvadratHeader}>
          <svg
            width="24.000000"
            height="24.000000"
            viewBox="0 0 24 24"
            fill="none"
          >
            <desc>Created with Pixso.</desc>
            <defs>
              <clipPath id="clip65_4147">
                <rect
                  id="bar / window"
                  rx="-0.500000"
                  width="23.000000"
                  height="23.000000"
                  transform="translate(0.500000 0.500000)"
                  fill="white"
                  fill-opacity="0"
                />
              </clipPath>
            </defs>
            <rect
              id="bar / window"
              rx="-0.500000"
              width="23.000000"
              height="23.000000"
              transform="translate(0.500000 0.500000)"
              fill="#FFFFFF"
              fill-opacity="0"
            />
            <g clip-path="url(#clip65_4147)">
              <path
                id="Vector"
                d="M18.66 5.33L9.33 5.33C8.97 5.33 8.64 5.47 8.39 5.72C8.14 5.97 8 6.31 8 6.66L8 8L9.33 8L9.33 6.66L18.66 6.66L18.66 13.33L17.33 13.33L17.33 14.66L18.66 14.66C19.02 14.66 19.35 14.52 19.6 14.27C19.85 14.02 20 13.68 20 13.33L20 6.66C20 6.31 19.85 5.97 19.6 5.72C19.35 5.47 19.02 5.33 18.66 5.33Z"
                fill="#3A3A3A"
                fill-opacity="1.000000"
                fill-rule="nonzero"
              />
              <path
                id="Vector"
                d="M14.66 9.33L5.33 9.33C4.97 9.33 4.64 9.47 4.39 9.72C4.14 9.97 4 10.31 4 10.66L4 17.33C4 17.68 4.14 18.02 4.39 18.27C4.64 18.52 4.97 18.66 5.33 18.66L14.66 18.66C15.02 18.66 15.35 18.52 15.6 18.27C15.85 18.02 16 17.68 16 17.33L16 10.66C16 10.31 15.85 9.97 15.6 9.72C15.35 9.47 15.02 9.33 14.66 9.33ZM5.33 17.33L5.33 10.66L14.66 10.66L14.66 17.33L5.33 17.33Z"
                fill="#3A3A3A"
                fill-opacity="1.000000"
                fill-rule="nonzero"
              />
            </g>
          </svg>
        </div>
        <div className={classes.exitHeader}>
          <svg
            width="12.000000"
            height="12.000000"
            viewBox="0 0 12 12"
            fill="none"
          >
            <desc>Created with Pixso.</desc>
            <defs />
            <path
              id="Vector"
              d="M6.97 5.96L11.83 1.1C11.94 0.97 12 0.81 11.99 0.64C11.99 0.47 11.92 0.32 11.8 0.2C11.68 0.08 11.52 0.01 11.35 0C11.19 0 11.02 0.05 10.89 0.16L6.03 5.02L1.17 0.16C1.05 0.05 0.88 -0.01 0.72 0C0.55 0 0.39 0.07 0.27 0.19C0.15 0.31 0.08 0.47 0.07 0.64C0.07 0.8 0.13 0.97 0.23 1.1L5.09 5.96L0.23 10.82C0.16 10.88 0.1 10.96 0.06 11.04C0.02 11.12 0 11.21 0 11.3C-0.01 11.39 0.01 11.49 0.04 11.57C0.07 11.66 0.13 11.73 0.19 11.8C0.26 11.86 0.33 11.92 0.42 11.95C0.5 11.98 0.6 12 0.69 11.99C0.78 11.99 0.87 11.97 0.95 11.93C1.03 11.89 1.11 11.83 1.17 11.76L6.03 6.9L10.89 11.76C11.02 11.87 11.19 11.93 11.35 11.92C11.52 11.92 11.68 11.85 11.8 11.73C11.92 11.61 11.99 11.45 11.99 11.28C12 11.11 11.94 10.95 11.83 10.82L6.97 5.96Z"
              fill="#3A3A3A"
              fill-opacity="1.000000"
              fill-rule="nonzero"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
