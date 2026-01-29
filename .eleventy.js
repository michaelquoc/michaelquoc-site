module.exports = function(eleventyConfig) {
  // Passthrough Copy for CSS and Images
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/_headers");
  // Favicon package (place files in project root; they copy to _site root)
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("favicon-16.png");
  eleventyConfig.addPassthroughCopy("favicon-32.png");
  eleventyConfig.addPassthroughCopy("apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("favicon-192.png");
  eleventyConfig.addPassthroughCopy("favicon-512.png");

  // Date Filter
  eleventyConfig.addFilter("dateDisplay", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
