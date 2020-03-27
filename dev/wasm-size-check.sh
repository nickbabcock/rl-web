#!/bin/bash

bytes=$(docker run --rm -i "$(docker build -q .)" find /usr/share/nginx/html -iname rl_wasm_bg-*.wasm -exec wc -c {} \; | cut -d " " -f1)
[[ $bytes -lt 1000 ]] && echo "wasm generated incorrectly" && exit 1
echo "done"
