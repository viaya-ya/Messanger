import { useGetStatisticsQuery } from "BLL/statisticsApi";
import useGetOldAndNewOrganizationId from "./useGetOrganizationId";

export default function useStatisticsHook({ statisticData }) {
  const { reduxNewSelectedOrganizationId } = useGetOldAndNewOrganizationId();
  const {
    statistics = [],
    isLoadingGetStatistics,
    isFetchingGetStatistics,
    isErrorGetStatistics,
    refetch,
  } = useGetStatisticsQuery(
    {
      organizationId: reduxNewSelectedOrganizationId,
      statisticData: statisticData,
    },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        statistics: data || [],
        isLoadingGetStatistics: isLoading,
        isFetchingGetStatistics: isFetching,
        isErrorGetStatistics: isError,
      }),
    }
  );

  return {
    statistics,
    isLoadingGetStatistics,
    isFetchingGetStatistics,
    isErrorGetStatistics,
  };
}
