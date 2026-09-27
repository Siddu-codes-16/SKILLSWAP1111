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

1. Create a new empty GitHub repository.
2. In this project folder, run:

   ```powershell
   git init
   git add .
   git commit -m "Initial SkillSwap Nearby site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
   git push -u origin main
   ```

3. In your GitHub repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
4. Wait for the **Deploy static site to GitHub Pages** workflow to finish. GitHub will display the public address in the Pages settings.

## Local data note

Avatar images, messages, profile changes, and new swaps remain in the browser where they were created. They are intentionally not uploaded anywhere. A production version would add authentication and a database (for example, Supabase or Firebase) before allowing people to share data with one another.
