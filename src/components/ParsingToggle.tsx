import { CloudsIcon, HelpIcon } from "@/components/icons";
import { useIsWorkerBusy } from "@/features/replay/useFilePublisher";
import { atom, useAtom } from "jotai";
import { useId } from "react";

export const parsingModeAtom = atom<"local" | "edge">("local");

export const ParsingToggle = () => {
  const toggleId = useId();
  const disabled = useIsWorkerBusy();
  const [parsingMode, setParsingMode] = useAtom(parsingModeAtom);
  return (
    <label className="flex items-center text-lg" htmlFor={toggleId}>
      Parse on edge:
      <input
        className="ml-2 mr-1"
        type="checkbox"
        name="edge"
        id={toggleId}
        disabled={disabled}
        onChange={(e) => setParsingMode(e.target.checked ? "edge" : "local")}
        checked={parsingMode === "edge"}
      />
      <CloudsIcon
        className={`w-7 transition ${
          parsingMode === "local" ? "grayscale" : ""
        }`}
        aria-hidden="true"
        focusable="false"
      />
    </label>
  );
};
