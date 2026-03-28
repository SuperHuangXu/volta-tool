import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./index.ts'],
  format: 'esm',
  outDir: './dist',
  minify: true,
  clean: true,
  deps: {
    onlyBundle: false,
  },
})
