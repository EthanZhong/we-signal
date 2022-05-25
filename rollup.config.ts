import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { readFileSync } from 'jsonfile';
import camelCase from 'camelcase';

const pkg = readFileSync('./package.json');
const name = camelCase(pkg.name, {
  pascalCase: true,
});
const input = './src/index.ts';

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
