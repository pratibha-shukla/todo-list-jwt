const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const path = require('path');

module.exports = defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'client'),
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:3000',
      '/lists': 'http://localhost:3000'
    }
  },
  build: {
    outDir: path.resolve(__dirname, 'client', 'dist'),
    emptyOutDir: true
  }
});
