import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'test',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    open: true
  }
});
