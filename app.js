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

  list.innerHTML = workshops.map((workshop) => `
    <article class="workshop-card">
      <span class="tag ${tagClass(workshop.track)}">${workshop.track || "Workshop"}</span>
      <h3>${workshop.title}</h3>
      <p class="workshop-meta">${workshop.name} | ${workshop.role}</p>
      <p class="location">${workshop.location || ""}</p>
      <p>${workshop.description}</p>
    </article>
  `).join("") || `<p>No workshops match that search.</p>`;
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

function renderSponsors() {
  const section = document.getElementById("sponsors");
  const link = document.querySelector(".sponsor-link");
  if (!data.showSponsors) {
    section.classList.add("is-hidden");
    link.classList.add("is-hidden");
    return;
  }

  const list = document.getElementById("sponsorList");
  list.innerHTML = data.sponsors.map((sponsor) => `
    <article class="sponsor-card">
      ${sponsor.logo ? `<img src="${sponsor.logo}" alt="${sponsor.name} logo">` : ""}
      <h3>${sponsor.name}</h3>
      <p>${sponsor.description}</p>
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

  const dialog = document.getElementById("speakerDialog");
  const dialogContent = document.getElementById("speakerDialogContent");
  document.getElementById("speakerList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-speaker]");
    if (!button) return;
    const speaker = data.speakers[Number(button.dataset.speaker)];
    dialogContent.innerHTML = `
      <div class="dialog-inner">
        <img src="${imageOrFallback(speaker.photo)}" alt="${speaker.name}">
        <div class="dialog-copy">
          <h2>${speaker.name}</h2>
          <p class="speaker-role">${speaker.role}</p>
          <p>${speaker.bio}</p>
        </div>
      </div>
    `;
    dialog.showModal();
  });

  document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
}

renderHeader();
renderSchedule();
renderSpeakers();
renderWorkshops();
renderInfo();
renderSponsors();
wireInteractions();
