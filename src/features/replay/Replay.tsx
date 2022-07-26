import { useReplayData } from "./replay-provider";
import { DropOverlay } from "./DropOverlay";
import { ReplayInput } from "./ReplayInput";
import { Report } from "@/features/viz";
import { WarningBox } from "@/components/WarningBox";

export const Replay = () => {
  const { replay, networkErr, criticalErr } = useReplayData();
  return (
    <div className="m-4 flex flex-col gap-2">
      <DropOverlay />
      <ReplayInput />
      <div className="max-w-prose mx-auto">
        <p>Drag and drop enabled</p>
      </div>
      {criticalErr ? (
        <WarningBox message={`Critical error: ${criticalErr}`} />
      ) : null}
      {networkErr ? (
        <WarningBox message={`Unable to parse network data: ${networkErr}`} />
      ) : null}
      {replay && replay.properties.PlayerStats ? (
        <Report replay={replay} stats={replay.properties.PlayerStats} />
      ) : null}
    </div>
  );
};
