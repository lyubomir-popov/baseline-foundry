import { defineConfig } from "vite";

export default defineConfig({
  // This repo writes generated theme artifacts into dist/ outside Vite's own build.
  // If emptyOutDir stays enabled, Vite ignores outDir in dev and serves stale CSS.
  build: {
    emptyOutDir: false,
  },
  server: {
    host: "127.0.0.1",
    port: parseInt(process.env.VITE_PORT || "4174", 10),
    strictPort: true,
    open: "/",
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  },
});
