/* CNR Slab Solutions */

const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

/* Nav */
const sections = document.querySelectorAll("section[id], header[id], .anchor-only[id]");
const navLinks = document.querySelectorAll(".nav-links a");

function setActiveNav() {
  let current = "";
  sections.forEach((sec) => {
    const top = sec.offsetTop - 96;
    if (window.scrollY >= top) current = sec.getAttribute("id") || "";
  });
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const isHome = href === "#top" && (!current || current === "top");
    link.classList.toggle("active", isHome || href === `#${current}`);
  });
}

window.addEventListener("scroll", setActiveNav, { passive: true });
setActiveNav();

const navMenu = document.getElementById("navMenu");
const navBackdrop = document.getElementById("navBackdrop");
const toggle = document.querySelector(".nav-toggle");

function setNavOpen(open) {
  navMenu?.classList.toggle("is-open", open);
  toggle?.setAttribute("aria-expanded", String(open));
  if (navBackdrop) navBackdrop.hidden = !open;
  document.body.style.overflow = open ? "hidden" : "";
}

toggle?.addEventListener("click", () => {
  setNavOpen(!navMenu?.classList.contains("is-open"));
});

navBackdrop?.addEventListener("click", () => setNavOpen(false));
navLinks.forEach((link) => link.addEventListener("click", () => setNavOpen(false)));

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) setNavOpen(false);
});

/**
 * Before/after slider with two aligned uploaded images.
 */
function initPairedComparison(config) {
  const { stage, clip, clipInner, divider, range, afterImg, defaultValue = 50 } = config;
  if (!stage || !clip || !clipInner || !range) return;

  function syncDimensions() {
    const w = stage.offsetWidth;
    const h = stage.offsetHeight;
    clipInner.style.width = `${w}px`;
    clipInner.style.height = `${h}px`;
    if (afterImg) {
      afterImg.style.width = `${w}px`;
      afterImg.style.height = `${h}px`;
    }
  }

  function setPosition(val) {
    const pct = `${val}%`;
    clip.style.width = pct;
    if (divider) divider.style.left = pct;
  }

  range.addEventListener("input", (e) => setPosition(e.target.value));
  setPosition(range.value || defaultValue);

  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(syncDimensions).observe(stage);
  }
  window.addEventListener("resize", syncDimensions);
  window.addEventListener("load", syncDimensions);
  syncDimensions();
}

const baAfterImg = document.getElementById("baAfterImg");

initPairedComparison({
  stage: document.getElementById("baSlider"),
  clip: document.getElementById("baClip"),
  clipInner: document.getElementById("baClipInner"),
  divider: document.getElementById("baDivider"),
  range: document.querySelector("#baSlider .ba-range"),
  afterImg: baAfterImg,
  defaultValue: 52,
});

initPairedComparison({
  stage: document.getElementById("teaserStage"),
  clip: document.getElementById("teaserClip"),
  clipInner: document.getElementById("teaserClipInner"),
  divider: document.getElementById("teaserDivider"),
  range: document.querySelector(".teaser-range"),
  afterImg: document.querySelector("#teaserClipInner .ba-paired-after"),
  defaultValue: 55,
});

/* Material preview on hero after image */
const materialOverlay = document.getElementById("materialOverlay");
const priceEl = document.getElementById("estimatedPrice");
const materialName = document.getElementById("materialName");
const vizSteps = document.querySelectorAll(".viz-steps li");

function applyMaterialPreview(textureSrc, material, isBroom) {
  if (!materialOverlay) return;

  materialOverlay.classList.remove("is-visible", "is-broom");

  if (!textureSrc || material === "Standard Gray") {
    materialOverlay.style.backgroundImage = "";
    return;
  }

  materialOverlay.style.backgroundImage = `url("${textureSrc}")`;
  materialOverlay.classList.add("is-visible");
  if (isBroom) materialOverlay.classList.add("is-broom");
}

document.querySelectorAll(".mat-thumb").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mat-thumb").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const material = btn.dataset.material;
    const texture = btn.dataset.texture || "";
    const price = Number(btn.dataset.price);

    if (materialName) materialName.textContent = material;
    if (priceEl) priceEl.innerHTML = `$${price.toLocaleString()} <small>USD</small>`;

    applyMaterialPreview(texture, material, material === "Broom Finish");
    vizSteps.forEach((s, i) => s.classList.toggle("active", i === 2 || i === 3));
  });
});

applyMaterialPreview("", "Standard Gray", false);

/* Calendar */
const miniCal = document.getElementById("miniCal");

if (miniCal) {
  const startOffset = 4;
  let html = '<div class="cal-head">May 2025</div>';
  ["S", "M", "T", "W", "T", "F", "S"].forEach((d) => {
    html += `<span class="cal-dow">${d}</span>`;
  });
  for (let i = 0; i < startOffset; i++) html += "<span></span>";
  for (let d = 1; d <= 31; d++) {
    const avail = d % 2 === 0 && d > 5;
    html += `<button type="button" class="${avail ? "available" : ""}" data-day="${d}">${d}</button>`;
  }
  miniCal.innerHTML = html;
  const defaultDay =
    miniCal.querySelector("button.available[data-day='14']") ||
    miniCal.querySelector("button.available");
  defaultDay?.classList.add("selected");
  miniCal.addEventListener("click", (e) => {
    const btn = e.target.closest("button.available");
    if (!btn) return;
    miniCal.querySelectorAll("button").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
  });
}

document.getElementById("bookBtn")?.addEventListener("click", () => {
  alert("Demo: consultation booking is not connected.");
});

document.getElementById("addOrder")?.addEventListener("click", () => {
  alert("Demo: checkout is not connected.");
});

/* Scroll reveal */
if (!isReducedMotion && !isCoarsePointer) {
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: "0px 0px -32px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
}

/* Live chat */
const liveChat = document.getElementById("liveChat");
const chatPanel = document.getElementById("chatPanel");
const chatClose = document.getElementById("chatClose");

liveChat?.addEventListener("click", () => {
  chatPanel.hidden = !chatPanel.hidden;
});
chatClose?.addEventListener("click", () => {
  chatPanel.hidden = true;
});

document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Demo: message not sent. Thanks for trying the showcase!");
});
