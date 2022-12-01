import { RlHead } from "@/components/head";
import { ParsingToggle, Replay } from "@/features/replay";
import { GithubIcon } from "@/components/icons";
import type { NextPage } from "next";
import { useHydrateUiStore } from "@/stores/uiStore";

const Home: NextPage = () => {
  useHydrateUiStore();

  return (
    <main className="p-4">
      <RlHead />
      <div className="mx-auto max-w-prose space-y-4">
        <div className="grid grid-cols-[1fr_32px] gap-2 md:gap-6">
          <h1 className="text-2xl font-bold">Rocket League Replay Parser</h1>
          <div>
            <a href="https://github.com/nickbabcock/rl-web">
              <GithubIcon alt="Rocket League Replay Parser website Github Repo" />
            </a>
          </div>
        </div>
        <p className="text-lg">
          The Rocket League Replay Parser decodes a replay and presents a small
          array of statistics. This tech demo shows the versatility of{" "}
          <a href="https://github.com/nickbabcock/boxcars">boxcars</a>, the
          underlying Rust-based library, as replays are parsed locally within
          the browser via a Wasm web worker. Additionally, one can instead opt
          into having the file uploaded to the edge to be parsed.
        </p>
        <p className="text-lg">
          A similar, but offline tool is{" "}
          <a href="https://github.com/nickbabcock/rrrocket">rrrocket</a>.
        </p>
        <ParsingToggle />
      </div>
      <Replay />
    </main>
  );
};

export default Home;
