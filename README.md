# Esolutions website

Static website for **Esolutions** — *Engineering Solutions for Your Business*.
Plain HTML, CSS and JavaScript. No build step, database or server code is needed.

## Files

```
index.html            Home
about.html            About Us
services.html         Services overview
hvac.html             HVAC
green-energy.html     Green Energy
electrical.html       Electrical Power Systems
projects.html         Projects (with category filter)
calculator.html       Solar savings calculator
articles.html         Articles (with category filter)
contact.html          Contact form and details
404.html              "Page not found" page
assets/css/style.css  All styles (colours are defined at the top)
assets/js/main.js     Menu, filters, calculator and contact form
assets/img/           Favicon and a temporary logo file
sitemap.xml, robots.txt, .nojekyll
```

## Publish on GitHub Pages

1. Create a new repository on GitHub (for example `esolutions-website`).
2. Upload **all files and folders from this ZIP** to the root of the repository (Add file → Upload files). Keep the folder structure, and include the `.nojekyll` file.
3. Go to **Settings → Pages**. Under "Build and deployment", choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and click Save.
4. After a minute or two the site is live at `https://YOUR-USERNAME.github.io/esolutions-website/`.

### Using your own domain (e.g. esolutions.ge)

1. In **Settings → Pages → Custom domain**, enter your domain and save.
2. At your domain registrar, add the DNS records GitHub shows you (A records for the root domain, or a CNAME record for `www`).
3. When the check passes, tick **Enforce HTTPS**.
4. Replace `https://YOUR-DOMAIN` in `sitemap.xml` and `robots.txt` with your real address.

## Connect the contact form

GitHub Pages cannot send email by itself, so the form uses a free form service:

1. Create a form at https://formspree.io (or https://web3forms.com) with the email address that should receive requests.
2. Copy the form endpoint URL it gives you (for Formspree it looks like `https://formspree.io/f/abcdwxyz`).
3. In `contact.html`, find `data-endpoint=""` on the `<form>` tag and paste the URL between the quotes.

Until this is done, the form asks visitors to call instead.

## Content still to replace

- Office address (`Street address, Tbilisi, Georgia`) — in every page footer and on `contact.html`.
- Photos: each grey grid box marked "Photo placeholder" is a `<div class="ph">`. To add a photo, put the image in `assets/img/` and add `<img src="assets/img/your-photo.jpg" alt="Description">` inside that box.
- Projects, testimonials (marked "Sample text"), team members, partner logos and articles.
- Social media links (the `FB`, `IG`, `IN` buttons in the footer, currently `href="#"`).
- Privacy Policy and Terms pages (footer links).
- Calculator assumptions: at the top of the calculator section in `assets/js/main.js` (`CALC = { ... }`).
- The logo is set in text (red "E", black "solutions"). If you have an official logo file, it can replace it.

## Changing colours

All colours are at the top of `assets/css/style.css`, for example `--brand-red` for the red "E" and main buttons.
