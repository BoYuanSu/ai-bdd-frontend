import { fileURLToPath } from 'node:url'
import { defineConfig, mergeConfig, configDefaults } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: [
        "./tests/setup.ts"
      ],
      browser: {
        enabled: true,
        provider: 'playwright',
        instances: [
          { browser: 'chromium' },
        ]
      }
    },
  }),
)