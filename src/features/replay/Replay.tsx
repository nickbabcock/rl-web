import { ReplayInput } from "./ReplayInput";
import { Report } from "@/features/viz";
import { WarningBox } from "@/components/WarningBox";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useLatestParse, useParsedReplay } from "./replayStore";

export const Replay = () => {
  const latestParse = useLatestParse();
  const parsedReplay = useParsedReplay();

  return (
    <div className="mt-4 flex flex-col gap-2">
      <ReplayInput />
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
      {parsedReplay !== null ? <Report replay={parsedReplay} /> : null}
    </div>
  );
};
