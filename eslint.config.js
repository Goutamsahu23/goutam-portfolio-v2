import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: { react },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Without this, imports used only as JSX (`motion.div`) read as unused.
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',
    },
  },
  {
    // Providers live alongside their hook and context; fast refresh gives up a
    // little granularity there in exchange for keeping the module cohesive.
    files: ['src/lib/**/*.jsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    // Build-time scripts run in Node, not the browser
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
