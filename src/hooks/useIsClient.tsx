import { useSyncExternalStore } from "react";

// The store never changes, so the subscribe callback does nothing.
const subscribe = () => () => {};

/** Reads a value that is only available after hydration. */
export function useClientValue<T>(read: () => T, serverValue: T) {
  return useSyncExternalStore(subscribe, read, () => serverValue);
}

export function useIsClient() {
  return useClientValue(() => true, false);
}
