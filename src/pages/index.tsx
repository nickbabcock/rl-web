import { RlHead } from "@/components/head";
import { Replay, ReplayProvider } from "@/features/replay";
import { ReplayParserProvider } from "@/features/worker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ParsingToggle } from "@/components/ParsingToggle";
import { GithubIcon } from "@/components/icons";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <main className="p-4">
      <RlHead />
      <div className="mx-auto max-w-prose space-y-4">
        <h1 className="flex gap-2 text-2xl font-bold md:gap-6">
          Rocket League Replay Parser{" "}
          <a href="https://github.com/nickbabcock/rl-web">
            <GithubIcon alt="Rocket League Replay Parser website Github Repo" />
          </a>
        </h1>
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
      <ReplayParserProvider>
        <ReplayProvider>
          <Replay />
        </ReplayProvider>
      </ReplayParserProvider>
    </main>
  );
};

export default Home;
