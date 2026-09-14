document.addEventListener("DOMContentLoaded", () => {
  function highlightCurrentTimelineItem() {
    const today = new Date();
    const currentYear = today.getFullYear();

    const timelineDates = {
      "May 20th": new Date(currentYear, 4, 20),
      "August 1st": new Date(currentYear, 7, 1),
      "August 21st": new Date(currentYear, 7, 21),
      "August 25th": new Date(currentYear, 7, 25),
      "September 13th": new Date(currentYear, 8, 13),
      "September 14th": new Date(currentYear, 8, 14),
      "September 14–15th": new Date(currentYear, 8, 15)
    };

    let closestItem = null;
    let closestDiff = Infinity;

    document.querySelectorAll(".timeline-item").forEach(item => {
      item.classList.remove("current", "upcoming");

      const dateText = item.querySelector(".tl-date")?.innerText.trim();
      const eventDate = timelineDates[dateText];

      if (!eventDate) return;

      const diffDays = Math.ceil(
        (eventDate - today) / (1000 * 60 * 60 * 24)
      );

      if (diffDays >= 0 && diffDays < closestDiff) {
        closestDiff = diffDays;
        closestItem = item;
      }
    });

    closestItem?.classList.add("current");
  }

  loadHTML("nav-container", "nav.html").then(() => {
    const hamburger = document.querySelector('.nav-hamburger');
    const nav = document.querySelector('.nav');
    if (!hamburger || !nav) return;


    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      // Reset all sub-menus when closing the hamburger
      if (!isOpen) {
        nav.querySelectorAll('.nav-dropdown.is-open').forEach(d => {
          d.classList.remove('is-open');
          d.querySelector('.nav-dropdown-trigger')?.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Tap on Students/Employers toggles their sub-menu on mobile;
    // hover/keyboard focus reveals it on desktop (see .nav-dropdown:hover /
    // :focus-within in homestyle.css). Keep aria-expanded in sync either way
    // so screen readers know these triggers open a submenu.
    nav.querySelectorAll('.nav-dropdown').forEach(dropdown => {
      const trigger = dropdown.querySelector('.nav-dropdown-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const isOpen = dropdown.classList.toggle('is-open');
          trigger.setAttribute('aria-expanded', isOpen);
        }
      });

      dropdown.addEventListener('mouseenter', () => trigger.setAttribute('aria-expanded', 'true'));
      dropdown.addEventListener('mouseleave', () => {
        if (!dropdown.classList.contains('is-open')) trigger.setAttribute('aria-expanded', 'false');
      });
      dropdown.addEventListener('focusin', () => trigger.setAttribute('aria-expanded', 'true'));
      dropdown.addEventListener('focusout', (e) => {
        if (!dropdown.contains(e.relatedTarget) && !dropdown.classList.contains('is-open')) {
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu when a page link is clicked
    nav.addEventListener('click', (e) => {
      if (e.target.matches('a') && !e.target.classList.contains('nav-dropdown-trigger')) {
        nav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open navigation menu');
        nav.querySelectorAll('.nav-dropdown.is-open').forEach(d => {
          d.classList.remove('is-open');
          d.querySelector('.nav-dropdown-trigger')?.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Close when clicking outside the nav
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        nav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        nav.querySelectorAll('.nav-dropdown.is-open').forEach(d => {
          d.classList.remove('is-open');
          d.querySelector('.nav-dropdown-trigger')?.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // ── NAV SEARCH ──
    const SEARCH_INDEX = [
      { title: 'Student Guide', url: 'student-guide.html', desc: 'Prepare for the fair — resume tips, attire, and more' },
      { title: 'Volunteer', url: 'volunteer.html', desc: 'Volunteer opportunities at the fair' },
      { title: 'Employer FAQ', url: 'employer-faq.html', desc: 'FAQs for employers — booths, registration, logistics' },
      { title: 'Receptions', url: 'receptions.html', desc: 'Pre-fair networking receptions Sep 12–13' },
      { title: 'About Us', url: 'about-us.html', desc: 'About SWE, Tau Beta Pi, and the fair history' },
      { title: 'Event Timeline', url: 'index.html#timeline', desc: 'Key dates — registration, receptions, fair days' },
      { title: 'Home', url: 'index.html', desc: 'Fall Engineering Career Fair — Sep 14–15, 2026' },
    ];

    const navSearchInput = document.querySelector('.nav-search .search-input');
    const navSearchContainer = document.querySelector('.nav-search');

    if (navSearchInput && navSearchContainer) {
      const resultsEl = document.createElement('div');
      resultsEl.className = 'nav-search-results';
      navSearchContainer.appendChild(resultsEl);

      function runSearch(q) {
        q = q.toLowerCase().trim();
        if (!q) { resultsEl.classList.remove('is-visible'); return; }

        const hits = SEARCH_INDEX.filter(item =>
          item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
        ).slice(0, 5);

        resultsEl.innerHTML = hits.length
          ? hits.map(item => `<a href="${item.url}" class="nav-search-result">
              <div class="nav-search-result-title">${item.title}</div>
              <div class="nav-search-result-desc">${item.desc}</div>
            </a>`).join('')
          : `<div class="nav-search-no-results">No results for "${q}"</div>`;

        resultsEl.classList.add('is-visible');
      }

      navSearchInput.addEventListener('input', e => runSearch(e.target.value));
      navSearchInput.addEventListener('focus', e => { if (e.target.value) runSearch(e.target.value); });
      navSearchInput.addEventListener('keydown', e => {
        if (e.key === 'Escape') { resultsEl.classList.remove('is-visible'); navSearchInput.blur(); }
      });
      document.addEventListener('click', e => {
        if (!navSearchContainer.contains(e.target)) resultsEl.classList.remove('is-visible');
      });
    }
  });
  loadHTML("footer-container", "footer.html");
  highlightCurrentTimelineItem();
});

async function loadHTML(containerId, filePath) {
  const container = document.getElementById(containerId);

  if (!container) return;

  try {
    const response = await fetch(filePath);
    container.innerHTML = await response.text();
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
  }
}
