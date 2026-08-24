const data = window.ALIVE_BOOKLET;

const text = (id, value) => {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
};

const imageOrFallback = (src) => src || "assets/theme/photo-placeholder.jpg";

function renderHeader() {
  text("eventName", data.event.name);
  text("eventMeta", `${data.event.date} | ${data.event.location}`);
  text("themeLine", data.event.name);
  text("heroTitle", data.event.theme);
  text("welcomeCopy", data.event.welcome);
  text("welcomeSignature", data.event.welcomeSignature || "");

  if (data.theme.heroImage) {
    document.documentElement.style.setProperty("--hero-image", `url("${data.theme.heroImage}")`);
  }

  if (data.theme.colors) {
    Object.entries(data.theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }
}

function renderSchedule() {
  const list = document.getElementById("scheduleList");
  list.innerHTML = data.schedule.map((item) => `
    <article class="timeline-item">
      <div class="time">${item.time}</div>
      <div>
        <h3>${item.title}</h3>
        <p class="location">${item.location || ""}</p>
        <p>${item.description || ""}</p>
      </div>
    </article>
  `).join("");
}

function renderSpeakers() {
  const list = document.getElementById("speakerList");
  list.innerHTML = data.speakers.map((speaker, index) => `
    <article class="speaker-card">
      <img src="${imageOrFallback(speaker.photo)}" alt="${speaker.name}">
      <div class="speaker-body">
        <h3>${speaker.name}</h3>
        <p class="speaker-role">${speaker.role}</p>
        <button class="button primary bio-button" type="button" data-speaker="${index}">
          Read Bio
        </button>
      </div>
    </article>
  `).join("");
}

function renderWorkshops(filter = "") {
  const list = document.getElementById("workshopList");
  const normalized = filter.trim().toLowerCase();
  const workshops = data.workshops.filter((workshop) => {
    const haystack = [
      workshop.title,
      workshop.name,
      workshop.role,
      workshop.track,
      workshop.description,
    ].join(" ").toLowerCase();
    return haystack.includes(normalized);
  });

  list.innerHTML = workshops.map((workshop, index) => {
    const detailsId = `workshop-details-${index}`;
    return `
    <article class="workshop-card">
      <button
        class="workshop-summary"
        type="button"
        aria-expanded="false"
        aria-controls="${detailsId}"
      >
        <span class="tag ${tagClass(workshop.track)}">${workshop.track || "Workshop"}</span>
        <span class="workshop-title">${workshop.title}</span>
        <span class="workshop-meta">${workshop.name} | ${workshop.role}</span>
        <span class="location">${workshop.location || ""}</span>
        <span class="expand-label" aria-hidden="true">Show Details</span>
      </button>
      <div class="workshop-details" id="${detailsId}" hidden>
        <p>${workshop.description}</p>
        ${workshop.bio ? `<button class="button primary workshop-bio-button" type="button" data-workshop-bio="${index}">Read Bio</button>` : ""}
      </div>
    </article>
  `;
  }).join("") || `<p>No workshops match that search.</p>`;
}

function tagClass(track = "") {
  const normalized = track.toLowerCase();
  if (normalized.includes("afternoon")) return "tag-afternoon";
  if (normalized.includes("leader")) return "tag-leaders";
  if (normalized.includes("morning")) return "tag-morning";
  return "";
}

function renderInfo() {
  const list = document.getElementById("infoList");
  list.innerHTML = data.info.map((item) => `
    <article class="info-card">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </article>
  `).join("");
}

function renderExhibitors() {
  const section = document.getElementById("exhibitors");
  const link = document.querySelector(".exhibitor-link");
  if (!data.showExhibitors) {
    section.classList.add("is-hidden");
    link.classList.add("is-hidden");
    return;
  }

  const list = document.getElementById("exhibitorList");
  list.innerHTML = data.exhibitors.map((exhibitor) => `
    <article class="exhibitor-card">
      <div class="exhibitor-logo-wrap">
        ${exhibitor.logo ? `<img class="exhibitor-logo" src="${exhibitor.logo}" alt="${exhibitor.name} logo">` : ""}
      </div>
      <a class="phone-ad" href="${exhibitor.link || exhibitor.ad}" target="_blank" rel="noopener">
        <img src="${exhibitor.ad}" alt="${exhibitor.name} advertisement">
      </a>
      <div class="exhibitor-body">
        <h3>${exhibitor.name}</h3>
        ${exhibitor.description ? `<p>${exhibitor.description}</p>` : ""}
        ${exhibitor.link ? `<a class="text-link" href="${exhibitor.link}" target="_blank" rel="noopener">Visit Website</a>` : ""}
      </div>
    </article>
  `).join("");
}

function wireInteractions() {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("siteNav");
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });

  document.getElementById("workshopSearch").addEventListener("input", (event) => {
    renderWorkshops(event.target.value);
  });

  document.getElementById("workshopList").addEventListener("click", (event) => {
    const bioButton = event.target.closest("[data-workshop-bio]");
    if (bioButton) {
      const workshop = data.workshops[Number(bioButton.dataset.workshopBio)];
      openBioDialog(workshop);
      return;
    }

    const button = event.target.closest(".workshop-summary");
    if (!button) return;
    const card = button.closest(".workshop-card");
    const details = card.querySelector(".workshop-details");
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    details.hidden = isOpen;
    card.classList.toggle("is-expanded", !isOpen);
  });

  const dialog = document.getElementById("speakerDialog");
  document.getElementById("speakerList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-speaker]");
    if (!button) return;
    const speaker = data.speakers[Number(button.dataset.speaker)];
    openBioDialog(speaker);
  });

  document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
}

function openBioDialog(person) {
  const dialog = document.getElementById("speakerDialog");
  const dialogContent = document.getElementById("speakerDialogContent");
  dialogContent.innerHTML = `
    <div class="dialog-inner">
      <img src="${imageOrFallback(person.photo)}" alt="${person.name}">
      <div class="dialog-copy">
        <h2>${person.name}</h2>
        <p class="speaker-role">${person.role}</p>
        <p>${person.bio}</p>
      </div>
    </div>
  `;
  dialog.showModal();
}

renderHeader();
renderSchedule();
renderSpeakers();
renderWorkshops();
renderInfo();
renderExhibitors();
wireInteractions();
