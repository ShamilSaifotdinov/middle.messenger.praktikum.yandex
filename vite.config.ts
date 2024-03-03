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
        outDir: resolve(__dirname, "dist"),
        rollupOptions: {
            input: {
                index: resolve(__dirname, "src/index.html"),
                login: resolve(__dirname, "src/login.html"),
                registry: resolve(__dirname, "src/registry.html"),
                chats: resolve(__dirname, "src/chats.html"),
                profile: resolve(__dirname, "src/profile.html"),
                404: resolve(__dirname, "src/404.html"),
                500: resolve(__dirname, "src/500.html")
            }
        }
    },
    plugins: [
        checker({ typescript: true })
    ]
})
