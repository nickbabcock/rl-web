import { useEffect, useState } from "react";
import { create } from "zustand";

export type ParseMode = "local" | "edge";

interface UiStoreData {
  parseMode: ParseMode;
  prettyPrint: boolean;
}

interface UiStore extends UiStoreData {
  actions: {
    setParseMode: (x: ParseMode) => void;
    setPrettyPrint: (x: boolean) => void;
  };
}

const initialData: UiStoreData = {
  parseMode: "local",
  prettyPrint: false,
};

const useUiStore = create<UiStore>()((set) => ({
  ...initialData,
  actions: {
    setParseMode: (x) => {
      const key = "parseMode";
      set(() => ({ [key]: x }));
      localStorage.setItem(key, JSON.stringify(x));
    },
    setPrettyPrint: (x) => {
      const key = "prettyPrint";
      set(() => ({ [key]: x }));
      localStorage.setItem(key, JSON.stringify(x));
    },
  },
}));

export const useUiActions = () => useUiStore((state) => state.actions);
export const useParseMode = () => useUiStore((state) => state.parseMode);
export const usePrettyPrint = () => useUiStore((state) => state.prettyPrint);

const getPersistedData = <K extends keyof UiStoreData>(
  key: K
): UiStoreData[K] => {
  const value = localStorage.getItem(key);
  if (value !== null) {
    return JSON.parse(value);
  } else {
    return initialData[key];
  }
};

export const useHydrateUiStore = () => {
  const { setParseMode, setPrettyPrint } = useUiActions();
  useEffect(() => setParseMode(getPersistedData("parseMode")), [setParseMode]);
  useEffect(
    () => setPrettyPrint(getPersistedData("prettyPrint")),
    [setPrettyPrint]
  );
};
