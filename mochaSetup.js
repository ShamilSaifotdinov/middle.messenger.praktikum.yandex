import jsdom from "jsdom"

const { JSDOM } = jsdom

const dom = new JSDOM("<!DOCTYPE html><div></div>", { url: "https://localhost:3000/" })

global.window = dom.window
global.document = dom.document
global.FormData = dom.FormData
