module.exports = {
    plugins: [
        require("@fullhuman/postcss-purgecss")({
            content: ["./**/*.{html,js}"],
            defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
        }),
    ],
};
