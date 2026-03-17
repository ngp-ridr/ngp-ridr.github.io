import { IdAttributePlugin, InputPathToUrlTransformPlugin } from "@11ty/eleventy";
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginNavigation from "@11ty/eleventy-navigation";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";

export default async function (eleventyConfig) {

  // --- Plugins ---
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(IdAttributePlugin, {
    // Only auto-generate IDs for headings inside article body content,
    // not inside card components (e.g. .post-card, .document-card)
    selector: ".post-body h1,.post-body h2,.post-body h3,.post-body h4,.page-body h1,.page-body h2,.page-body h3,.page-body h4,.document-abstract h1,.document-abstract h2,.document-abstract h3",
  });
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

  // --- Markdown configuration ---
  const md = markdownIt({ html: true, linkify: true, typographer: true })
    .use(markdownItAnchor, { permalink: markdownItAnchor.permalink.headerLink() });
  eleventyConfig.setLibrary("md", md);

  // --- Passthrough copies ---
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/media");
  eleventyConfig.addPassthroughCopy({ "src/content/documents/**/*.pdf": "documents" });

  // --- Collections ---

  // News posts: newest first
  eleventyConfig.addCollection("news", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/content/news/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Static pages: sorted by optional `order` front matter
  eleventyConfig.addCollection("pages", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/content/pages/*.md")
      .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));
  });

  // Documents/Reports: newest first
  eleventyConfig.addCollection("documents", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/content/documents/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Featured news: posts where featured: true
  eleventyConfig.addCollection("featuredNews", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/content/news/*.md")
      .filter((item) => item.data.featured === true)
      .sort((a, b) => b.date - a.date);
  });

  // --- Filters ---

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  });

  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return new Date(dateObj).toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  eleventyConfig.addFilter("tagSlug", (tag) =>
    tag.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
  );

  // --- Shortcodes ---

  // Renders a Leaflet map container; use with mapEnabled: true in front matter
  eleventyConfig.addShortcode("mapEmbed", (id, lat, lng, zoom = 6) => {
    return `<div class="map-embed" id="${id}" data-lat="${lat}" data-lng="${lng}" data-zoom="${zoom}" aria-label="Interactive map"></div>`;
  });

  // Renders a Chart.js canvas; use with chartEnabled: true in front matter
  eleventyConfig.addShortcode("chartEmbed", (id, type, src) => {
    return `<canvas class="chart-embed" id="${id}" data-chart-type="${type}" data-src="${src}" aria-label="Data visualization"></canvas>`;
  });

  eleventyConfig.addShortcode("figure", (src, alt, caption = "") => {
    const cap = caption ? `<figcaption>${caption}</figcaption>` : "";
    return `<figure><img src="${src}" alt="${alt}" loading="lazy">${cap}</figure>`;
  });

}

export const config = {
  dir: {
    input: "src",
    output: "_site",
    includes: "_includes",
    layouts: "_includes/layouts",
    data: "_data",
  },
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  templateFormats: ["html", "njk", "md"],
  // Set ELEVENTY_PATH_PREFIX env var to override (e.g. /website/ on GitHub Pages
  // without a custom domain). Defaults to "/" for local dev and custom domain deploys.
  pathPrefix: process.env.ELEVENTY_PATH_PREFIX ?? "/",
};
