import { CloudsIcon } from "@/components/icons";
import { useIsActionInFlight } from "@/hooks";
import { useParseMode, useUiActions } from "@/stores/uiStore";
import { useId } from "react";

export const ParsingToggle = () => {
  const toggleId = useId();
  const disabled = useIsActionInFlight();
  const { setParseMode } = useUiActions();
  const parseMode = useParseMode();
  return (
    <label className="inline-flex items-center text-lg" htmlFor={toggleId}>
      Parse on edge:
      <input
        className="ml-2 mr-1"
        type="checkbox"
        name="edge"
        id={toggleId}
        disabled={disabled}
        onChange={(e) => setParseMode(e.target.checked ? "edge" : "local")}
        checked={parseMode === "edge"}
      />
      <CloudsIcon
        className={`w-7 transition ${parseMode === "local" ? "grayscale" : ""}`}
        aria-hidden="true"
        focusable="false"
      />
    </label>
  );
};
