import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-instagram-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith('/api/instagram')) {
            try {
              const { default: handler } = await import('./api/instagram.js');
              res.status = (code) => {
                res.statusCode = code;
                return res;
              };
              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              };
              await handler(req, res);
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }
          next();
        });
      },
    },
  ],
  build: {
    target: 'es2022',
    cssMinify: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/[name]-v7-[hash].[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
  },
});
