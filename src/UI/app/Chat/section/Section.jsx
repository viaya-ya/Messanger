import React, { useState } from "react";
import classes from "./Section.module.css";
import { useOrganization } from "./hook/getOrganization";
import { useDispatch } from "react-redux";
import imgOrganization from "../../../sprite/organization.svg";
import { setNewSelectedOrganizationId } from "BLL/localStorage/localStorageSlice";
import { selectedOrganizationId } from "BLL/baseUrl";
import useGetOldAndNewOrganizationId from "UI/hooks/useGetOldAndNewOrganizationId";

export default function Section() {
  const { organizations, isLoadingOrganization, isErrorOrganization } =
    useOrganization();

  const dispatch = useDispatch();

  const handleOrganizationNameButtonClick = (id, name) => {
    localStorage.setItem("selectedOrganizationId", id);
    localStorage.setItem("name", name);

    dispatch(setNewSelectedOrganizationId(id));
  };

  const { reduxNewSelectedOrganizationId } = useGetOldAndNewOrganizationId();
  return (
    <div className={classes.section}>
      <div className={classes.name}>
        <span>Организации</span>
      </div>
      <div className={classes.block}>
        {organizations.map((item) => (
          <div
            key={item.id}
            className={`${classes.row} ${
              reduxNewSelectedOrganizationId === item.id
                ? classes.row_active
                : ""
            }`}
            onClick={() =>
              handleOrganizationNameButtonClick(item.id, item.organizationName)
            }
          >
            <img
              src={imgOrganization}
              alt="imgOrganization"
              className={classes.svg}
            />
            <span>{item.organizationName}</span>
          </div>
        ))}
        <div className={classes.line}></div>
      </div>
    </div>
  );
}
