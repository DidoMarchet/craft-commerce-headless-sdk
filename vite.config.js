import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['./'],
    }),
  ],
  build: {
    lib: {
      entry: './index.ts', // Entry point for the library
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
});
