import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://awesomeprivacy.org",
  trailingSlash: "always",
  redirects: { "/alternatives": "/replace/" },
  devToolbar: { enabled: false },
  // Astro hashes its own scripts and styles; everything else may only come from this site.
  security: {
    csp: {
      directives: ["default-src 'self'", "img-src 'self'", "font-src 'self'", "connect-src 'self'", "base-uri 'self'", "form-action 'self'", "object-src 'none'"],
    },
  },
});
