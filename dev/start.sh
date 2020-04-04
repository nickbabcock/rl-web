#!/bin/bash

npm run build
npx tsc --watch --preserveWatchOutput &
npx webpack --mode production --watch &
hugo serve --renderToDisk --bind 0.0.0.0
