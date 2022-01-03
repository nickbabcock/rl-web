import { RlHead } from "@/components/head";
import { Replay, ReplayProvider } from "@/features/replay";
import { ReplayParserProvider } from "@/features/worker";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <main>
      <RlHead />
      <h1>Rocket League Replay Parser</h1>
      <p>
        The Rocket League Replay Parser will decode a replay within the browser
        and present a small array of statistics. This site is meant to
        demonstrate the versatility of the underlying{" "}
        <a href="https://github.com/nickbabcock/boxcars">
          Rust based parser, boxcars
        </a>
        . A similar, but offline tool is{" "}
        <a href="https://github.com/nickbabcock/rrrocket">rrrocket</a>. For a
        more feature rich analysis of replays, see{" "}
        <a href="https://calculated.gg/">calculated.gg</a>. Feel free contribute
        suggestions, issues, or code on{" "}
        <a href="https://github.com/nickbabcock/rl-web">the Github repo</a>.
      </p>
      <p>No data is uploaded to any server</p>
      <ReplayParserProvider>
        <ReplayProvider>
          <Replay />
        </ReplayProvider>
      </ReplayParserProvider>
    </main>
  );
};

export default Home;
