module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/js");

  const markdownIt = require("markdown-it");
  const md = markdownIt({ html: true, breaks: true, linkify: false });
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addFilter("dateFormat", (date, locale) => {
    return new Date(date).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
      year: "numeric", month: "long", day: "numeric"
    });
  });

  eleventyConfig.addFilter("t", function(key) {
    const lang = this.ctx.lang || "ko";
    const strings = this.ctx[lang] || {};
    return strings[key] || key;
  });

  eleventyConfig.addCollection("koEpisodes", col =>
    col.getFilteredByGlob("src/content/ko/ep*.md")
       .sort((a, b) => a.data.episode - b.data.episode)
  );

  eleventyConfig.addCollection("enEpisodes", col =>
    col.getFilteredByGlob("src/content/en/ep*.md")
       .sort((a, b) => a.data.episode - b.data.episode)
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
