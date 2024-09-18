import React, { useState, useEffect } from "react";
import classes from "./PolicyContent.module.css";
import icon from "../../image/iconHeader.svg";
import add from "../../image/add.svg";
import L from "../../image/L.svg";
import E from "../../image/E.svg";
import R from "../../image/R.svg";
import J from "../../image/J.svg";
import numeration from "../../image/numeration.svg";
import bulet from "../../image/bulet.svg";
import Bold from "../../image/Bold.svg";
import Italic from "../../image/Italic.svg";
import Underline from "../../image/Underline.svg";
import Crosed from "../../image/Crosed.svg";
import Select from "../../image/Select.svg";
import iconBack from "../../image/iconBack.svg";
import mountain from "../../image/mountain.svg";
import oval from "../../image/oval.svg";
import subbarSearch from "../../image/subbarSearch.svg";
import iconSavetmp from "../../image/iconSavetmp.svg";
import email from "../../image/email.svg";
import iconGroup from "../../image/iconGroup.svg";
import greySavetmp from "../../image/greySavetmp.svg";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetPoliciesQuery,
  usePostPoliciesMutation,
} from "../../../BLL/policyApi";

export default function PolicyContent() {
  const navigate = useNavigate();
  const back = () => {
    navigate("/start");
  };

  const { userId } = useParams();
  const { data = [], isLoading } = useGetPoliciesQuery(userId);
  const [postPolicy, { isError }] = usePostPoliciesMutation();
  const savePolicy = async () => {
    await postPolicy({
      userId,
      policyName: "Пипка",
      state: "Черновик",
      type: "Директива",
      content: "попа",
      policyToOrganizations: ["865a8a3f-8197-41ee-b4cf-ba432d7fd51f"]
    }).unwrap();
  };
  if (isLoading) return <div>Loading....</div>;
  return (
    <div className={classes.dialog}>
      <div className={classes.header}>
        <div className={classes.fon}></div>
        <div className={classes.pomoshnikSearch}>
          <div className={classes.pomoshnik}>
            <img
              src={iconBack}
              alt="iconBack"
              onClick={() => back()}
              className={classes.iconBack}
            />
            <div>
              <img
                src={icon}
                alt="icon"
                style={{ width: "33px", height: "33px" }}
              />
            </div>

            <div className={classes.spanPomoshnik}>
              <span>Личный помощник</span>
            </div>
          </div>
          <input
            type="search"
            placeholder="Поиск"
            className={classes.search}
            // value={searchTerm}
            // onChange={handleSearchChange}
          />
        </div>

        <div className={classes.editText}>
          <div className={classes.one}>
            <img src={L} alt="L" />
            <img src={E} alt="E" />
            <img src={R} alt="R" />
            <img src={J} alt="J" />
          </div>
          <div className={classes.two}>
            <img src={numeration} alt="numeration" />
            <img src={bulet} alt="bulet" />
          </div>
          <div className={classes.three}>
            <img src={Bold} alt="Bold" />
            <img src={Italic} alt="Italic" />
            <img src={Underline} alt="Underline" />
            <img src={Crosed} alt="Crosed" />
          </div>

          <div className={classes.four}>
            <img src={mountain} alt="mountain" />
            <img src={oval} alt="oval" />
          </div>

          <div className={classes.five}>
            <select name="mySelect">
              <option value="">Директива</option>
              <option value="option1">Инструкция</option>
            </select>
          </div>

          <div className={classes.sixth}>
            <img src={subbarSearch} alt="subbarSearch" />
            <div>
              <span>Политика 97</span>
            </div>
          </div>

          <div className={classes.blockSelect}>
            <img src={Select} alt="Select" className={classes.select} />
            <ul className={classes.option}>
              <li>
                {" "}
                <img src={email} alt="email" /> Отправить сотруднику для
                прочтения
              </li>
              <li>
                {" "}
                <img src={iconGroup} alt="iconGroup" /> В должностную инструкцию
                постам
              </li>
              <li>
                {" "}
                <img src={greySavetmp} alt="greySavetmp" /> Сохранить и издать{" "}
              </li>
            </ul>
          </div>
          <img
            src={iconSavetmp}
            alt="iconSavetmp"
            className={classes.iconSavetmp}
            style={{ marginLeft: "0.5%" }}
          />
        </div>
      </div>

      <div className={classes.main}>
        {data.map((item) => {
          <textarea className={classes.Teaxtaera} />;
        })}
        <button onClick={() => savePolicy()}>Save</button>
      </div>
    </div>
  );
}
