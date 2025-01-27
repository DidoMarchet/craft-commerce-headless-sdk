import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [basicSsl()],
  build: {
    lib: {
      entry: './src/index.ts', // Entry point for the library
      name: 'Craft Commerce Headless SDK', // Global variable name for UMD builds
      fileName: (format) => `craft-commerce-headless-sdk.${format}.js`, // Output file name
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
  server: {
    https: true
  },
});
