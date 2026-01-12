module.exports = function(eleventyConfig) {
  // -----------------------------------------------------------------
  // 1. ASSET PASSTHROUGHS
  // -----------------------------------------------------------------
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/assets");

  // -----------------------------------------------------------------
  // 2. THE PHYSICS ENGINE (Collections)
  // -----------------------------------------------------------------
  
  // Physics Collection (Treatises)
  eleventyConfig.addCollection("physics", function(collection) {
    return collection.getFilteredByGlob("src/physics/*.md")
      .sort((a, b) => {
        return (b.data.gravity || 0) - (a.data.gravity || 0) || b.date - a.date;
      });
  });
  
  // -----------------------------------------------------------------
  // 3. FILTERS (The Missing Piece)
  // -----------------------------------------------------------------

  // Filter: Extract Axioms for Logic Map
  eleventyConfig.addFilter("extractAxioms", function(content) {
    if (!content) return [];
    const axioms = [];
    const regex = /<h2[^>]*>(Axiom\s.*?)<\/h2>/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      axioms.push(match[1].replace(/<[^>]*>/g, ""));
    }
    return axioms;
  });

  // Filter: Date Formatter (FIXES YOUR BUILD ERROR)
  eleventyConfig.addFilter("dateDisplay", function(dateObj) {
    if (!dateObj) return "";
    // Handle string dates or JS Date objects
    const date = new Date(dateObj);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  });

  // -----------------------------------------------------------------
  // 4. BUILD CONFIGURATION
  // -----------------------------------------------------------------
  return {
    dir: {
      input: "src",
      output: "public"
    }
  };
};