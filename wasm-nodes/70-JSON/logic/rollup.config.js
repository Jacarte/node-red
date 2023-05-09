import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
export default {
  input: '70-WJSON.logic.js', // your main entry point
  output: {
    file: 'bundle.js',  // the bundle file you want to output
    format: 'cjs'  // output format
  },
  plugins: [
    resolve(), // so Rollup can find `node_modules`
    commonjs(), // so Rollup can convert `node_modules` to an ES module,
    json(), // To load json
  ]
};