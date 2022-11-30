import { ReplayInput } from "./ReplayInput";
import { Report } from "@/features/viz";
import { WarningBox } from "@/components/WarningBox";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useLatestParse, useParsedReplay } from "./replayStore";

export const Replay = () => {
  const latestParse = useLatestParse();
  const parsedReplay = useParsedReplay();

  return (
    <div className="m-4 flex flex-col space-y-2">
      <div className="flex flex-col items-center space-y-1">
        <ReplayInput />
        <p className="text-xs">(Drag and drop enabled)</p>
      </div>
      {latestParse.kind === "error" ? (
        <WarningBox
          message={`Unable to parse (${latestParse.input.path()}): ${getErrorMessage(
            latestParse.error
          )}`}
        />
      ) : null}
      {parsedReplay?.networkErr ? (
        <WarningBox message={`network data: ${parsedReplay.networkErr}`} />
      ) : null}
      {parsedReplay !== null && parsedReplay.data.properties.PlayerStats ? (
        <Report
          replay={parsedReplay}
          stats={parsedReplay.data.properties.PlayerStats}
        />
      ) : null}
    </div>
  );
};
