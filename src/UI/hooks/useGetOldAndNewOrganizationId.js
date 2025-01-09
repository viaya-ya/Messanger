import React from 'react'
import { useSelector } from "react-redux";

export default function useGetOldAndNewOrganizationId() {
  const reduxOldSelectedOrganizationId = useSelector(
    (state) => state.localStorage.oldSelectedOrganizationId
  );
  const reduxNewSelectedOrganizationId = useSelector(
    (state) => state.localStorage.newSelectedOrganizationId
  );

  return {
    reduxOldSelectedOrganizationId,
    reduxNewSelectedOrganizationId
  }
}
