import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';

// The root config exists only to serve the lint-staged pre-commit hook.
// `web/` has its own Next.js config, which is what `pnpm lint` runs.
//
// Previously this config registered no TypeScript parser while still matching
// `**/*.ts`, so every staged .ts file failed to parse and the pre-commit hook
// rejected the commit outright.
export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/*.config.js',
      '**/*.config.ts',
      'infra/**',
      'web/sanity.types.ts',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
  {
    // studio/scripts/* are CommonJS maintenance scripts run under Node.
    files: ['**/scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'writable',
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx,mts}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // Type-aware correctness is covered by `pnpm typecheck` and by the
      // Next.js config in web/; this pass only needs to parse cleanly.
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
];
