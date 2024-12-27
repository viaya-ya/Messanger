

import { useGetOrganizationsQuery } from "BLL/organizationApi";

export function useOrganization() {

  const {
    organizations = [],
    isLoadingOrganization,
    isErrorOrganization,
  } = useGetOrganizationsQuery(undefined, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      organizations: data?.organizations || [],
      isLoadingOrganization: isLoading,
      isErrorOrganization: isError,
    }),
  });

  return {
    organizations,
    isLoadingOrganization,
    isErrorOrganization
  };
}
