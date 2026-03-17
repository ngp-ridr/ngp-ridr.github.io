import siteData from "./site.json" with { type: "json" };

// Navigation is defined in site.json so it can be edited via Pages CMS Site Settings.
export default function () {
  return {
    primary: siteData.nav ?? [],
  };
}
