#!/bin/bash
deno run --allow-net --allow-read --watch --unstable app.ts &
npm update chokidar
npm i
npm run webpack-watch