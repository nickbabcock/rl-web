# Rocket League Replay Parser (rl-web)

[![CI](https://github.com/nickbabcock/rl-web/actions/workflows/ci.yml/badge.svg)](https://github.com/nickbabcock/rl-web/actions/workflows/ci.yml)

The Rocket League Replay Parser decodes a replay and presents a small array of
statistics. This tech demo shows the versatility of
[boxcars](https://github.com/nickbabcock/boxcars), the underlying Rust-based
library, as replays are parsed locally within the browser via a Wasm web worker.
Additionally, one can instead opt into having the file uploaded to the edge to
be parsed.

A similar, but offline tool is
[rrrocket](https://github.com/nickbabcock/rrrocket).

## Screenshot

![Screenshot of web page](dev/rl-web-screenshot.png?raw=true)
