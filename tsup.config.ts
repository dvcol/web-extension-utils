import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['lib', '!lib/**/*.test.ts', '!lib/mocks'],
  format: ['cjs', 'esm'],
  sourcemap: false,
  clean: true,
  dts: true,
});
