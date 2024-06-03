import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['lib/index.ts', 'lib/chrome', 'lib/http', 'lib/common'],
  format: ['cjs', 'esm'],
  sourcemap: false,
  clean: true,
  dts: true,
});
