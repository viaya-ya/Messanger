import {
  useDeleteControlPanelMutation,
  useGetAllControlPanelQuery,
  useGetControlPanelIdQuery,
  usePostControlPanelMutation,
  useUpdateControlPanelMutation,
} from "BLL/controlPanel/controlPanelApi";
import useGetOrganizationId from "./useGetOrganizationId";

export default function useControlPanel({ selectedControlPanelId }) {
  const { reduxNewSelectedOrganizationId } = useGetOrganizationId();

  const {
    allControlPanel = [],
    isErrorGetAllControlPanel,
    isLoadingGetAllControlPanel,
    isFetchingGetAllControlPanel,
  } = useGetAllControlPanelQuery(
    { organizationId: reduxNewSelectedOrganizationId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        allControlPanel: data || [],
        isErrorGetAllControlPanel: isError,
        isLoadingGetAllControlPanel: isLoading,
        isFetchingGetAllControlPanel: isFetching,
      }),
    }
  );

  const {
    currentControlPanel = {},
    statisticsIdsInPanel = [],
    statisticsPoints = [],
    isLoadingGetontrolPanelId,
    isFetchingGetontrolPanelId,
    isErrorGetontrolPanelId,
  } = useGetControlPanelIdQuery(
    { controlPanelId: selectedControlPanelId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentControlPanel: data?.response || {},
        statisticsIdsInPanel: data?.statisticsIdsInPanel || [],
        statisticsPoints: data?.statisticsPoints || [],
        isLoadingGetontrolPanelId: isLoading,
        isErrorGetontrolPanelId: isError,
        isFetchingGetontrolPanelId: isFetching,
      }),
      skip: !selectedControlPanelId,
    }
  );

  const [
    postControlPanel,
    {
      isLoading: isLoadingPostControlPanelMutation,
      isSuccess: isSuccessPostControlPanelMutation,
      isError: isErrorPostControlPanelMutation,
      error: ErrorPostControlPanel,
    },
  ] = usePostControlPanelMutation();

  const [
    updateControlPanel,
    {
      isLoading: isLoadingUpdateControlPanelMutation,
      isSuccess: isSuccessUpdateControlPanelMutation,
      isError: isErrorUpdateControlPanelMutation,
      error: ErrorUpdateControlPanel,
    },
  ] = useUpdateControlPanelMutation();

  const [
    deleteControlPanel,
    {
      isLoading: isLoadingDeleteControlPanelMutation,
      isSuccess: isSuccessDeleteControlPanelMutation,
      isError: isErrorDeleteControlPanelMutation,
      error: ErrorDeleteControlPanel,
    },
  ] = useDeleteControlPanelMutation();

  return {
    reduxNewSelectedOrganizationId,

    // Получение всех панелей по организации
    allControlPanel,
    isErrorGetAllControlPanel,
    isLoadingGetAllControlPanel,
    isFetchingGetAllControlPanel,

    // Получение панели по id
    currentControlPanel,
    statisticsIdsInPanel,
    statisticsPoints,
    isLoadingGetontrolPanelId,
    isFetchingGetontrolPanelId,
    isErrorGetontrolPanelId,

    // Создание панели
    postControlPanel,
    isLoadingPostControlPanelMutation,
    isSuccessPostControlPanelMutation,
    isErrorPostControlPanelMutation,
    ErrorPostControlPanel,

    //  Обновление
    updateControlPanel,
    isLoadingUpdateControlPanelMutation,
    isSuccessUpdateControlPanelMutation,
    isErrorUpdateControlPanelMutation,
    ErrorUpdateControlPanel,

    // Удаление статистики
    deleteControlPanel,
    isLoadingDeleteControlPanelMutation,
    isSuccessDeleteControlPanelMutation,
    isErrorDeleteControlPanelMutation,
    ErrorDeleteControlPanel,
  };
}
