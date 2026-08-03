import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import { string } from 'rollup-plugin-string';

export default [
  {
    input: 'userScript.js',
    output: {
      // Version the runtime filename so untagged jsDelivr releases cannot fall
      // back to a permanently cached file from an older tag.
      file: '../dist/userScript-v1.4.3-test.6.js',
      format: 'iife'
    },
    plugins: [
      string({
        include: '**/*.css'
      }),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env']
      }),
      terser()
    ]
  }
];
