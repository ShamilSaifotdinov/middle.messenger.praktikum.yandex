module.exports = {
    plugins: [
        require("postcss-simple-vars")({
            variables: {
                main: "#FFFFFF",
                secondary: "#F2F1F6",
                deep_grey: "#D9D9D9",
                blue: "#007AFF",
                red: "#E65441",
                white: "#FFFFFF",
                grey_text: "#707076",
            }
        }),
        require("postcss-import"),
    ]
}
