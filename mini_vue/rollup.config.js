

import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'
export default {
    input: './src/index.ts',
    output: [
        // 1. .cjs -> CommonJS
        // 2. .esm.js -> ES Module
        {
            file: pkg.main,
            format: 'cjs'
        },
        {
            file: pkg.module,
            format: 'esm'
        }
    ],
    plugins: [
        typescript()
    ]
}