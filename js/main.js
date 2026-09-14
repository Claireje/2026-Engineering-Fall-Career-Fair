// Highlights the next upcoming date on the homepage timeline (index.html only).
// Everything else that used to live here — loading nav.html/footer.html,
// the mobile hamburger menu, the dropdown menus, and the (unused) nav search —
// is now plain HTML/CSS. See nav/footer markup and the "HAMBURGER / MOBILE NAV"
// and "NAV DROPDOWN" sections of css/homestyle.css.
document.addEventListener("DOMContentLoaded", () => {
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
});
