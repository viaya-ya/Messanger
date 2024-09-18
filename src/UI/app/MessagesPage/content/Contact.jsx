import React from "react";
import classes from "./Contact.module.css";
import iconHeader from "../../../image/iconHeader.svg";

export default function Contact() {
  return (
    <div className={classes.contact}>
      <div className={classes.header}>
        <div className={classes.headerName}>контакты</div>
        <svg
          width="24.000000"
          height="24.000000"
          viewBox="0 0 24 24"
          fill="none"
        >
          <desc>Created with Pixso.</desc>
          <defs>
            <clipPath id="clip20_2259">
              <rect
                id="icon / menu"
                width="24.000000"
                height="24.000000"
                fill="white"
                fill-opacity="0"
              />
            </clipPath>
          </defs>
          <rect
            id="icon / menu"
            width="24.000000"
            height="24.000000"
            fill="#FFFFFF"
            fill-opacity="0"
          />
          <g clip-path="url(#clip20_2259)">
            <path
              id="Vector 36"
              d="M5 7L19 7"
              stroke="#FFFFFF"
              stroke-opacity="1.000000"
              stroke-width="2.000000"
              stroke-linecap="round"
            />
            <path
              id="Vector 37"
              d="M5 12L19 12"
              stroke="#FFFFFF"
              stroke-opacity="1.000000"
              stroke-width="2.000000"
              stroke-linecap="round"
            />
            <path
              id="Vector 38"
              d="M5 17L19 17"
              stroke="#FFFFFF"
              stroke-opacity="1.000000"
              stroke-width="2.000000"
              stroke-linecap="round"
            />
          </g>
        </svg>
      </div>
      <div className={classes.search}>
        <input type="search" placeholder="поиск"></input>
      </div>
      <div className={classes.main}>
        <div className={classes.item}>
          <img src={iconHeader} alt="iconHeader" />
          <div>Личный помощник</div>
        </div>
      </div>
    </div>
  );
}
