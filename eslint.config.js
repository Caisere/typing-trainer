import antfu from '@antfu/eslint-config';

// export default antfu({
//   formatters: true,
//   react: true,
// }, {
//   rules: {
//     'prefer-arrow-callback': 'off',
//   },
// })

export default antfu(
  {
    type: 'app',
    typescript: true,
    formatters: true,
    react: true,
    stylistic: {
      indent: 2,
      semi: true,
      quotes: 'single',
    },
    ignores: ['src/routeTree.gen.ts', 'dist', '.claude', '.partykit'],
  },
  {
    rules: {
      'prefer-arrow-callback': 'off',
      'ts/no-redeclare': 'off',
      'ts/consistent-type-definitions': ['error', 'type'],
      'no-console': ['warn'],
      'antfu/no-top-level-await': ['off'],
      'node/prefer-global/process': ['off'],
      'node/no-process-env': ['error'],
      'perfectionist/sort-imports': [
        'error',
        {
          tsconfigRootDir: '.',
        },
      ],
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
          ignore: ['README.md'],
        },
      ],
    },
  },
);
