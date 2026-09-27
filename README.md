# SkillSwap Nearby

A polished, responsive front-end prototype for a local skill-exchange community. It is built with plain HTML, CSS, and JavaScript, so there is no build step and it can be deployed directly to GitHub Pages.

## Included

- Responsive landing page, discovery view, community-map illustration, and personal dashboard
- Search, category, and distance filtering for suggested members
- Create-swap form, in-browser messaging, profile editing, and local avatar upload
- Browser-local persistence with `localStorage` — no account or server required
- GitHub Actions workflow that publishes the site to GitHub Pages on every push to `main`

## Run it locally

Open `index.html` in a modern browser. For the smoothest experience, open this folder in VS Code and use a local-server extension such as **Live Server**.

## Publish to GitHub Pages

## Local data note

Avatar images, messages, profile changes, and new swaps remain in the browser where they were created. They are intentionally not uploaded anywhere. A production version would add authentication and a database (for example, Supabase or Firebase) before allowing people to share data with one another.
