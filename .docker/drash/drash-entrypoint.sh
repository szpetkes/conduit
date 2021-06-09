#!/bin/bash
export DENO_DIR=./deno_dir
deno run --allow-net --allow-read --watch --unstable app.ts &
npm update chokidar
npm i
npm run webpack-watch