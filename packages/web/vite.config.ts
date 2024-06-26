import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

export default defineConfig(({ mode }) => {
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      'process.env.AUTH0_DOMAIN': JSON.stringify(env.AUTH0_DOMAIN),
      'process.env.AUTH0_CLIENT_ID': JSON.stringify(env.AUTH0_CLIENT_ID),
      'process.env.AUTH0_AUDIENCE': JSON.stringify(env.AUTH0_AUDIENCE),
      'process.env.API_URL': JSON.stringify(env.API_URL),
      'process.env.APP_SECRET_KEY': JSON.stringify(env.APP_SECRET_KEY),
    },
    build: {
      target: 'esnext',
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
