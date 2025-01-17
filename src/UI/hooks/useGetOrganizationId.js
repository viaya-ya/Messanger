import { useSelector } from "react-redux";

export default function useGetOrganizationId() {
  const reduxNewSelectedOrganizationId = useSelector(
    (state) => state.localStorage.newSelectedOrganizationId
  );

  return {
    reduxNewSelectedOrganizationId
  }
}
