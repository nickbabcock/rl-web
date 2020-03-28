# Rocket League Replay Parser (rl-web)

[![Build Status](https://dev.azure.com/nbabcock19/nbabcock19/_apis/build/status/nickbabcock.rl-web?branchName=master)](https://dev.azure.com/nbabcock19/nbabcock19/_build/latest?definitionId=4&branchName=master)

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

## Goals

- **Lightweight**: Javascript bundle weighs < 10kb gzipped to facilitate quick loading. No HTTP extraneous requests. No tracking. No ads. Even though the web assembly modules weighs ~250kb, the website scores a [perfect 100 in lighthouse](https://googlechrome.github.io/lighthouse/viewer/?gist=b63fb2e0a102aee1e92a2c038b9a42cd).
- **WebAssembly**: [Boxcars](https://github.com/nickbabcock/boxcars) is used behind the scenes due to how efficient it is at parsing replays. Boxcars is in Rust, but through WebAssembly we can see the same efficiency in the browser. Even though the web assembly module is heftiest component on the page, this is a postive trade to demonstrate compiling Rust to web assembly, the speed that it brings, and that it saves developer time and bugs by not needing to rewrite the parsing logic in javascript.
- **Minimal dependencies**: This web app only relies on a single js and css dependency: ([preact](https://preactjs.com/) and [sanitize.css](https://csstools.github.io/sanitize.css/)). Minimal dependencies help keep the app lightweight and results in easier maintenance as it reduces the possibility of breaking changes and funky interactions between libraries. To a lesser extent, dev dependencies should be minimized to mitigate the possibility of the build breaking. Fewer dev dependencies are worth it even if this means sacrificing trendy features like css modules.
- **Easy Maintenance**: rl-web is not destined for greatness, but it can expect to see sporadic updates. These updates should not be bogged down trying to re-grok the codebase or fixing dependencies. They should, as much as possible, be spent adding features / bugfixes.
- **Static Typing**: [Typescript](https://www.typescriptlang.org/) removes the cognitive burden of null checks, type definitions, and eliminates silly mistsakes which in turns allows for easier maintenance where one can focus on bugfixes and features.
- **Minimal Config**: Using a minimal webpack config makes it easier to verify and grok, even if that omitting fancy options / plugins.
- **Integration Testing**: [Cypress](https://www.cypress.io/) is used for end to end tests against the actual site. These tests confirm ability of the WebAssembly and js to function against real world input. Integration tests allows rl-web to skip component testing in favor of . With no component tests, rl-web is free to swap out the internals (ie: move to a different framework or eschew all of them) and not invalidate any tests (easy maintenance). There are still unit tests, but only those that don't use the DOM.

## Non-Goals

- **Increase browser support**: [90% of users have access to WebAssembly](https://caniuse.com/#feat=wasm). It's futile to chase that last 10%.
- **Server**: While it would be cool to allow users to upload replays to allow others to view the statistics, having a server to store replays increases costs and complexity. Not practical at this time.
- **Competition**: You want actual statistics and value? [calculated.gg](https://calculated.gg/). In light of calculated.gg, rl-web should be viewed as an experiment.
