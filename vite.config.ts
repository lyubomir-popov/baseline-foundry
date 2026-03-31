import { defineConfig } from "vite";
import type { Plugin } from "vite";

function noCachePlugin(): Plugin {
  return {
    name: "no-cache",
    configureServer(server) {
      server.middlewares.use((_req, res, next) => {
        const origSetHeader = res.setHeader.bind(res);
        res.setHeader = (name: string, value: string | number | readonly string[]) => {
          if (name.toLowerCase() === "etag" || name.toLowerCase() === "last-modified") {
            return res;
          }
          return origSetHeader(name, value);
        };
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [noCachePlugin()],
  server: {
    host: "127.0.0.1",
    port: parseInt(process.env.VITE_PORT || "4174", 10),
    strictPort: true,
    open: "/",
  },
});
