import { useGetStrategiesQuery } from "BLL/strategy/strategApi";

export function useGetStrategies() {
  const {
    hasDraftStrategy,
    completedStrategies,
    draftAndActiveStrategies,
    activeStrategyId,
    isLoadingStrategies,
    isErrorStrategies,
    isFetchingStrategies
  } = useGetStrategiesQuery(undefined, {
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
    hasDraftStrategy,
    completedStrategies,
    draftAndActiveStrategies,
    activeStrategyId,
    isLoadingStrategies,
    isErrorStrategies,
    isFetchingStrategies
  };
}
