# Vintage Bird Press — Website

A plain HTML/CSS site for GitHub Pages (no build tools, no frameworks), styled
from the Baldwin Terney Press site: same warm-paper palette, Fraunces + Inter
fonts, and terracotta accent.

Right now it's a single **coming soon** page.

```
index.html               Coming-soon page
404.html                 "Page not found" page (GitHub Pages uses it automatically)
.nojekyll                Tells GitHub Pages to serve the files as-is
robots.txt               Lets search engines index the site
assets/css/style.css     All styling — colors/fonts are CSS variables at the top
assets/images/mark.svg   The bird logo (also used as the browser-tab icon)
```

## Quick edits

- **Contact email:** in `index.html`, search for `mailto:` and change the address.
- **Headline / message:** edit the `<h1>` and `<p class="lead">` in `index.html`.
- **Colors:** edit the variables at the top of `assets/css/style.css`.

## Custom domain

When you have a domain, add it under the repo's **Settings → Pages → Custom
domain**. GitHub will create a `CNAME` file in the repo for you. Then add the
DNS records listed in `../git-and-readme-reference.md`.

## Publishing updates

```
git add .
git commit -m "Describe what you changed"
git push
```
