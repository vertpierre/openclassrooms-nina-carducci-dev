module.exports = {
    plugins: [
        require("@fullhuman/postcss-purgecss")({
            content: ["**/*.{html,js,css}"],
            defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
        }),
    ],
};
