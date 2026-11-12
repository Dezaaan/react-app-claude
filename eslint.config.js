import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// Use "@/..." for anything outside the current folder: it reads the same
// from every file and survives moving files around.
const parentImports = {
  regex: '^\\.\\./',
  message: 'Import with "@/..." instead of "../".',
}

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'no-restricted-imports': ['error', { patterns: [parentImports] }],
    },
  },
  {
    // Shared code is used by everything, so it can't depend on the app.
    files: ['src/shared/**/*.{ts,tsx}'],
    ignores: ['src/shared/**/*.test.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            parentImports,
            {
              group: ['@/features/*', '@/pages/*', '@/app/*'],
              message: 'shared/ must not import from features, pages or app.',
            },
          ],
        },
      ],
    },
  },
])
