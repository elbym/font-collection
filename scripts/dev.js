// Dev: einmal bauen, dann Eleventy- und Tailwind-Watch plus Server starten; Strg+C beendet alle.
const { spawn, spawnSync } = require("child_process");

if (spawnSync("npm", ["run", "build"], { stdio: "inherit" }).status) process.exit(1);

const procs = [
  ["npx", ["eleventy", "--watch"]],
  ["npx", ["tailwindcss", "-i", "src/css/tailwind.css", "-o", "_site/tailwind.css", "--watch"]],
  ["node", ["scripts/build-js.js", "--dev"]],
  ["python3", ["server.py"]],
].map(([cmd, args]) => spawn(cmd, args, { stdio: "inherit" }));

const stop = () => { procs.forEach((p) => p.kill()); process.exit(); };
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
procs.forEach((p) => p.on("exit", stop));
