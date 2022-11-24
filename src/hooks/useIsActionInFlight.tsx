import { useIsFetching, useIsMutating } from "@tanstack/react-query";

export const useIsActionInFlight = () =>
  useIsFetching() + useIsMutating() !== 0;
