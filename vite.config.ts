// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  build: {
    target: 'esnext',
  },
  esbuild: {
    target: 'esnext'
  },
  vite: {
    // Tauri expects a fixed port, fail if that port is not available
    server: {
      strictPort: true,
      host: true, // required for android dev
    },
    // Env variables starting with the item of `envPrefix` will be exposed in tauri's source code through `import.meta.env`.
    envPrefix: ['VITE_', 'TAURI_ENV_'],
    build: {
      // Tauri uses Chromium on Windows and WebKit on macOS and Linux
      target: process.env.TAURI_ENV_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
      // don't minify for debug builds
      minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
      // produce sourcemaps for debug builds
      sourcemap: !!process.env.TAURI_ENV_DEBUG,
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
