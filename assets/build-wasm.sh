#!/bin/bash -eu

pushd crate
wasm-pack build --target web $@
popd

mkdir -p dist
cp crate/pkg/rl_wasm_bg.wasm dist/.
cp assets/3d07e.replay dist/sample.replay

# Parcel doesn't support the experimental import feature
sed -i -e '/import.meta.url.replace/d' crate/pkg/rl_wasm.js
