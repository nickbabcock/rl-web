import { parsingModeAtom } from "@/components/ParsingToggle";
import { ParsedReplay, ParseInput, useReplayParser } from "@/features/worker";
import {
  useIsFetching,
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { atom, useAtomValue, useSetAtom } from "jotai";

const statusAtom = atom<"idle" | "loading" | "error" | "success">("idle");
export const dataAtom = atom<undefined | ParsedReplay>(undefined);
export const errorAtom = atom<null | unknown>(null);
export const inputAtom = atom<ParseInput | undefined>(undefined);
export const inputNameAtom = atom<undefined | string>(undefined);
export const parsedNameAtom = atom<undefined | string>(undefined);
export const parsedRawNameAtom = atom<undefined | string>(undefined);
export const successModeAtom = atom<"local" | "edge">("local");
export const jsonNameAtom = atom<undefined | string>((get) => {
  const name = get(parsedNameAtom);
  return `${name?.replace(".replay", "")}.json`;
});

export const useIsWorkerBusy = () => useIsFetching() + useIsMutating() !== 0;

interface MutationContext {
  name: string;
  raw: string;
}

export function useFilePublisher() {
  const queryClient = useQueryClient();
  const parser = useReplayParser();
  const setStatus = useSetAtom(statusAtom);
  const setData = useSetAtom(dataAtom);
  const setError = useSetAtom(errorAtom);
  const setInputName = useSetAtom(inputNameAtom);
  const setParsedName = useSetAtom(parsedNameAtom);
  const parsingMode = useAtomValue(parsingModeAtom);
  const setSuccessMode = useSetAtom(successModeAtom);
  const setParsedRawName = useSetAtom(parsedRawNameAtom);
  const setInputAtom = useSetAtom(inputAtom);

  const { mutate } = useMutation({
    mutationFn: async (input: ParseInput) => {
      if (parsingMode === "local") {
        return parser().parse(input);
      } else {
        const form = new FormData();
        form.append("file", input);
        const res = await fetch("/api/replay", {
          method: "POST",
          body: form,
        });

        if (!res.ok) {
          throw new Error("edge parser returned an error");
        } else {
          return await res.json();
        }
      }
    },
    networkMode: parsingMode === "local" ? "always" : "online",
    onSuccess(data, variables, context?: MutationContext) {
      setSuccessMode(parsingMode);
      setStatus("success");
      setData(data);
      setInputAtom(variables);
      setParsedName(context?.name);
      setParsedRawName(context?.raw);
      queryClient.invalidateQueries();
    },
    onMutate(variables): MutationContext {
      setStatus("loading");
      if (typeof variables === "string") {
        let name = variables.slice(variables.lastIndexOf("/") + 1);
        return { raw: variables, name };
      } else {
        return { raw: variables.name, name: variables.name };
      }
    },
    onError(_error, _variables, _context) {
      setStatus("error");
    },
    onSettled(_data, error, _variables, context) {
      setInputName(context?.name);
      setError(error);
    },
  });

  return {
    mutate,
  };
}
