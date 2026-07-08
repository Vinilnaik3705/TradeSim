import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars from the frontend dir AND the repo root (where hosting
  // providers / sandboxes mirror project env files), without prefix filtering.
  const localEnv = loadEnv(mode, __dirname, '')
  const rootEnv = loadEnv(mode, path.resolve(__dirname, '..'), '')

  const pick = (...keys) => {
    for (const key of keys) {
      const val = process.env[key] || localEnv[key] || rootEnv[key]
      if (val) return val
    }
    return ''
  }

  // Resolve Supabase credentials from any common naming convention so auth
  // works locally, in the sandbox, and on Vercel without manual renaming.
  const supabaseUrl = pick('VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL')
  const supabaseAnonKey = pick('VITE_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY')

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
    },
    server: {
      // Proxy API + websocket traffic to the local Express backend in dev so
      // the browser always talks same-origin (required in cloud previews).
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
        '/health': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
        '/ws': {
          target: 'ws://localhost:5000',
          ws: true,
          changeOrigin: true,
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1600,
    },
  }
})
