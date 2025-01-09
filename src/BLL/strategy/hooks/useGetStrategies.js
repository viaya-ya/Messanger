import { useGetStrategiesQuery } from "BLL/strategy/strategApi";
import useGetOldAndNewOrganizationId from "UI/hooks/useGetOldAndNewOrganizationId";

export function useGetStrategies() {

   const {reduxNewSelectedOrganizationId } =
      useGetOldAndNewOrganizationId();

  const {
    hasDraftStrategy,
    completedStrategies,
    draftAndActiveStrategies,
    activeStrategyId,
    isLoadingStrategies,
    isErrorStrategies,
    isFetchingStrategies
  } = useGetStrategiesQuery({organizationId:reduxNewSelectedOrganizationId}, {
    selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
      hasDraftStrategy: data?.hasDraftStrategy || [],
      completedStrategies: data?.completedStrategies || [],
      draftAndActiveStrategies: data?.draftAndActiveStrategies || [],
      activeStrategyId: data?.activeStrategyId || "",
      isLoadingStrategies: isLoading,
      isErrorStrategies: isError,
      isFetchingStrategies: isFetching
    }),
  });

  return {
    reduxNewSelectedOrganizationId,
    hasDraftStrategy,
    completedStrategies,
    draftAndActiveStrategies,
    activeStrategyId,
    isLoadingStrategies,
    isErrorStrategies,
    isFetchingStrategies
  };
}
