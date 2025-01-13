import { useSelector } from "react-redux";

export default function useGetOldAndNewOrganizationId() {
  const reduxNewSelectedOrganizationId = useSelector(
    (state) => state.localStorage.newSelectedOrganizationId
  );

  return {
    reduxNewSelectedOrganizationId
  }
}
