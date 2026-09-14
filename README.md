# Fall Engineering Career Fair 2026

This is the website for the UMich Fall Engineering Career Fair, happening September 14 and 15, 2026.

## Running it

Just open any of the HTML files in your browser. No server, no build step, nothing to install.

## How it's put together

Every page is its own HTML file with the same shared stylesheet, `css/style.css`. The nav and footer are copied into each page instead of loaded from a shared file, so if you change the nav you'll need to update it on all 8 pages.

The only JavaScript on the whole site is `js/main.js`, and it's only loaded on the homepage. All it does is highlight whichever date on the timeline is coming up next.

## Making changes

Nav or footer: edit it directly in each HTML file (search for `class="nav"` or `<footer`).

Event dates: update the hero section in `index.html` and the dates in `js/main.js`.

Directors and committee: `about-us.html` and `student-leadership.html`.

Volunteer shifts: `volunteer.html`.

Company logos: drop a PNG in `img/logos/companies/` and add it to the grid in `index.html`.

Sitewide styles: `css/style.css`.

## Deploying

Push to main. GitHub Pages builds it automatically, no build step needed.
