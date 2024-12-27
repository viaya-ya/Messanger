import React from "react";
import classes from "./Section.module.css";
import { useOrganization } from "./hook/getOrganization";
import imgOrganization from "../../../sprite/organization.svg";

export default function Section() {
  const { organizations, isLoadingOrganization, isErrorOrganization } = useOrganization();

  const handleOrganizationNameButtonClick = (id) => {
    localStorage.setItem("selectedOrganizationId", id);
  };

  return (
    <div className={classes.section}>
      <div className={classes.name}>
        <span>Организации</span>
      </div>
      <div className={classes.block}>
        {organizations.map((item) => (
          <div
            key={item.id}
            className={classes.row}
            onClick={() => handleOrganizationNameButtonClick(item.id)}
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
