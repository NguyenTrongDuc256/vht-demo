import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@smart-duty/logic': path.resolve(
        __dirname,
        'src/features/smart-duty/logic/src',
      ),
      '@smart-duty/view': path.resolve(
        __dirname,
        'src/features/smart-duty/view/src',
      ),
      '@app': path.resolve(__dirname, 'src/app'),
    },
  },
})
