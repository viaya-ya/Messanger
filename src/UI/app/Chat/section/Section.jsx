import React, {useState} from "react";
import classes from "./Section.module.css";
import { useOrganization } from "./hook/getOrganization";
import imgOrganization from "../../../sprite/organization.svg";

export default function Section() {
  const { organizations, isLoadingOrganization, isErrorOrganization } = useOrganization();

  const [activeId, setActiveId] = useState(null); // Храним id выбранного элемента

  const handleOrganizationNameButtonClick = (id) => {
    setActiveId(id); // Устанавливаем выбранный id
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
            className={`${classes.row} ${
              activeId === item.id ? classes.row_active : ""
            }`}
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
