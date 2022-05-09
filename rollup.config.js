import typescript from '@rollup/plugin-typescript';
// import eslint from '@rollup/plugin-eslint';
import { terser } from 'rollup-plugin-terser';
import camelCase from 'camelcase';
const pkg = require('./package.json');
const name = camelCase(pkg.name, {
  pascalCase: true,
});
const input = './lib/index.ts';
export default {
  input,
  output: [
    {
      file: pkg.main,
      name,
      format: 'umd',
      sourcemap: true,
      plugins: [terser()],
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [typescript()],
};
