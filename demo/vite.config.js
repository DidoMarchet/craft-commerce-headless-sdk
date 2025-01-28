import basicSsl from '@vitejs/plugin-basic-ssl';

export default {
  plugins: [basicSsl()],
  server: {
    https: true,
    open: true, // Apri automaticamente il browser
  }
};