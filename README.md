# Rocket League Replay Parser (rl-web)

[![CI](https://github.com/nickbabcock/rl-web/actions/workflows/ci.yml/badge.svg)](https://github.com/nickbabcock/rl-web/actions/workflows/ci.yml)

The Rocket League Replay Parser (rl-web) allows one to select a local [Rocket
League](https://www.rocketleague.com/) replay and view statistics all from the
comfort of their browser without any data being uploaded. This repo is meant to
demonstrate the versatility of the underlying [Rust based parser,
boxcars](https://googlechrome.github.io/lighthouse/viewer/?gist=b63fb2e0a102aee1e92a2c038b9a42cd)
which compiled to web assembly for parsing performance. A similar, but
offline tool is [rrrocket](https://github.com/nickbabcock/rrrocket). For a more
feature rich analysis of replays, see [calculated.gg](https://calculated.gg/)

## Screenshot

![Screenshot of web page](dev/rl-web-screenshot.png?raw=true)
