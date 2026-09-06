export default {
  schema: './sanity.config.ts',
  generates: {
    './sanity.types.ts': {
      preset: 'typescript',
    },
  },
};
