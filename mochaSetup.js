import jsdom from "jsdom"

const { JSDOM } = jsdom

const dom = new JSDOM(
    "<!DOCTYPE html><body><main id=\"app\"></main><body>",
    { url: "https://localhost:3000/" }
)

global.window = dom.window
global.document = dom.window.document
global.FormData = dom.window.FormData
