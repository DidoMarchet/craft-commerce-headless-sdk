import basicSsl from '@vitejs/plugin-basic-ssl';

export default {
  plugins: [basicSsl()],
  server: {
    https: true,
    open: true, // Apri automaticamente il browser
  },
  build: {
    rollupOptions: {
      external: [], // Non contrassegnare nulla come esterno
    },
  },
  resolve: {
    alias: {
      '@stripe/stripe-js': require.resolve('@stripe/stripe-js'), // Risolve il percorso per Netlify
    },
  },
};