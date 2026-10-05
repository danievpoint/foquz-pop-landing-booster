import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Inline the header background so the navbar logo/clouds paint together with the page.
    assetsInlineLimit: (file: string) => (/navbar-header-bg\.(svg|webp)$/.test(file) ? true : undefined),
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // recharts is only used by the dashboard – keep it off the critical path.
          "vendor-ui": ["framer-motion"],
          "vendor-supabase": ["@supabase/supabase-js"],
        },
      },
    },
  },
}));
