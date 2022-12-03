import { ParseInput, useReplayParser } from "@/features/worker";
import { useParseMode } from "@/stores/uiStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useReplayActions } from "./replayStore";

export function useFilePublisher() {
  const queryClient = useQueryClient();
  const parser = useReplayParser();
  const parseMode = useParseMode();
  const { parseError, parsed } = useReplayActions();

  const { mutate } = useMutation({
    mutationKey: ["parse"],
    mutationFn: async (input: ParseInput) => {
      if (input === "SERVER_SAMPLE") {
        const res = await fetch("/api/sample");
        if (!res.ok) {
          throw new Error("server parser returned an error");
        } else {
          return await res.json();
        }
      }

      if (parseMode === "local") {
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
    networkMode: parseMode === "local" ? "always" : "online",
    onSuccess(data, variables, _context) {
      parsed(data, parseMode, { input: variables });
      queryClient.invalidateQueries();
    },
    onError(error, variables, _context) {
      parseError(error, { input: variables });
    },
  });

  return {
    mutate,
  };
}
