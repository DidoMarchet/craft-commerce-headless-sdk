// vite.config.ts
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['./'],
      outputDir: 'dist', 
    }),
  ],
  build: {
    lib: {
      entry: './index.ts', 
      name: 'CraftCommerceHeadlessSdk',
      fileName: (format) => `craft-commerce-headless-sdk.${format}.js`,
      formats: ['es', 'umd'], 
    },
    outDir: 'dist', // Questo deve essere al di fuori dell'oggetto lib
    rollupOptions: {
      external: [], 
      output: {
        globals: {}, 
      },
    },
    emptyOutDir: true, 
  },
});
