import { useReplayData } from "./replay-provider";
import { DropOverlay } from "./DropOverlay";
import { ReplayInput } from "./ReplayInput";
import { Report } from "@/features/viz";
import { WarningBox } from "@/components/WarningBox";
import {
  dataAtom,
  errorAtom,
  inputNameAtom,
  parsedNameAtom,
} from "./useFilePublisher";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useAtomValue } from "jotai";

export const Replay = () => {
  const inputName = useAtomValue(inputNameAtom);
  const data = useAtomValue(dataAtom);
  const error = useAtomValue(errorAtom);
  const parsedName = useAtomValue(parsedNameAtom);

  return (
    <div className="m-4 flex flex-col space-y-2">
      <DropOverlay />
      <div className="flex flex-col items-center space-y-1">
        <ReplayInput />
        <p className="text-xs">(Drag and drop enabled)</p>
      </div>
      {error ? (
        <WarningBox
          message={`Unable to parse (${inputName}): ${getErrorMessage(error)}`}
        />
      ) : null}
      {data?.networkErr ? (
        <WarningBox message={`network data: ${data?.networkErr}`} />
      ) : null}
      {parsedName && data?.replay && data?.replay.properties.PlayerStats ? (
        <Report
          name={parsedName}
          replay={data?.replay}
          stats={data?.replay.properties.PlayerStats}
        />
      ) : null}
    </div>
  );
};
