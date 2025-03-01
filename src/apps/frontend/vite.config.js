import { defineConfig } from 'vite'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@camagru/field-check': path.resolve(__dirname, '../../common/field-check/index.js'),
        },
    },
})