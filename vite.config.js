import handlebars from "vite-plugin-handlebars"
import { resolve } from "path"
import { defineConfig } from "vite";

export default defineConfig({
  root: resolve(__dirname, "src"),
  plugins: [
    handlebars({
      partialDirectory: [
        resolve(__dirname, 'src/components/button_link'),
        resolve(__dirname, 'src/components/link'),
        resolve(__dirname, 'src/components/frame'),
        resolve(__dirname, 'src/components/input'),
        resolve(__dirname, 'src/layout/auth'),
        resolve(__dirname, 'src/layout/error'),
      ],
      context: {
        title: "Hello, world!",
        profile: {
          name: "test",
        },
      },
    })
  ],
})