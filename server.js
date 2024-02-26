import express from "express"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3000

app.use(express.static(resolve(__dirname, "dist")))

app.use("/*", (req, res) => {
    res.sendFile(resolve(__dirname, "dist/index.html"))
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
})
