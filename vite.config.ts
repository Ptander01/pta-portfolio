import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        /* Vendor code changes on dependency bumps; site content changes most
           weeks. Splitting them means a copy edit doesn't invalidate React and
           framer-motion in every returning visitor's cache. Only long-lived,
           genuinely shared deps belong here — anything route-specific should
           ride along with its own route chunk instead. */
        /* Matched on resolved path, not bare specifier. The object form of
           manualChunks misses `react-dom/client` — which is what main.tsx
           actually imports — and silently leaves react-dom in the app chunk,
           where it gets invalidated by every content edit. */
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/node_modules\/(react|react-dom|scheduler|wouter)\//.test(id)) {
            return "react";
          }
          if (/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(id)) {
            return "motion";
          }
        },
      },
    },
  },
  server: {
    /* Honour PORT so two dev servers can run side by side; 3000 stays the
       default when nothing sets it. */
    port: Number(process.env.PORT) || 3000,
    host: true,
    allowedHosts: true,
  },
});
