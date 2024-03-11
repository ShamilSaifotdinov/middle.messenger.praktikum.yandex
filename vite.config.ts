import { resolve } from "path"
import { defineConfig } from "vite"
import checker from "vite-plugin-checker"

export default defineConfig({
    root: resolve(__dirname, "src"),
    resolve: {
        alias: {
            "@": resolve(__dirname, "public")
        }
    },
    build: {
        outDir: resolve(__dirname, "dist")
    },
    plugins: [
        checker({ typescript: true })
    ]
})
