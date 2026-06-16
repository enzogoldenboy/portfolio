// ============ Portfolio interactions ============

// Page intro — remove after animation
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.querySelector(".page-intro");
  if (intro) setTimeout(() => intro.remove(), 2000);

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Filters (projets page)
  const filterButtons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll("[data-cat]");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      cards.forEach((c) => {
        const show = f === "Tout" || c.dataset.cat === f;
        c.style.display = show ? "" : "none";
      });
    });
  });

  // Project details modal
  const projectCards = document.querySelectorAll(".project-card");
  if (projectCards.length) {
    const modal = document.createElement("div");
    modal.className = "project-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="project-modal__backdrop" data-modal-close></div>
      <div class="project-modal__panel" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
        <button class="project-modal__close" type="button" aria-label="Fermer" data-modal-close>&times;</button>
        <div class="project-modal__media">
          <img alt="" />
          <span></span>
        </div>
        <div class="project-modal__content">
          <p class="project-modal__label"></p>
          <h2 id="project-modal-title"></h2>
          <p class="project-modal__subtitle"></p>
          <p class="project-modal__description"></p>
          <a class="project-modal__link" href="#" target="_blank" rel="noopener noreferrer">Voir sur GitHub</a>
          <div class="project-modal__meta"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const titleEl = modal.querySelector("h2");
    const labelEl = modal.querySelector(".project-modal__label");
    const subtitleEl = modal.querySelector(".project-modal__subtitle");
    const descriptionEl = modal.querySelector(".project-modal__description");
    const linkEl = modal.querySelector(".project-modal__link");
    const metaEl = modal.querySelector(".project-modal__meta");
    const mediaImg = modal.querySelector(".project-modal__media img");
    const mediaText = modal.querySelector(".project-modal__media span");
    let previousFocus = null;

    const getProjectImage = (card) => {
      const explicitImage = card.dataset.image;
      const img = card.querySelector(".img-box img");
      const placeholder = card.querySelector(".img-box")?.textContent.trim();
      return explicitImage || img?.getAttribute("src") || placeholder || "";
    };

    const openProjectModal = (card) => {
      previousFocus = document.activeElement;
      const title = card.dataset.title || card.querySelector("h3")?.textContent.trim() || "Projet";
      const label = card.dataset.category || card.querySelector(".label")?.textContent.trim() || "Projet";
      const subtitle = card.dataset.subtitle || card.querySelector(".sub")?.textContent.trim() || "";
      const image = getProjectImage(card);
      const description = card.dataset.description || "Ajoute ici une description plus detaillee du projet : contexte, objectif, contraintes, ce que tu as construit et le resultat obtenu.";
      const github = card.dataset.github;
      const meta = [
        card.dataset.role && ["Role", card.dataset.role],
        card.dataset.stack && ["Stack", card.dataset.stack],
        card.dataset.year && ["Annee", card.dataset.year],
      ].filter(Boolean);

      titleEl.textContent = title;
      labelEl.textContent = label;
      subtitleEl.textContent = subtitle;
      descriptionEl.textContent = description;
      linkEl.hidden = !github;
      if (github) linkEl.href = github;
      metaEl.innerHTML = meta.map(([key, value]) => `<p><span>${key}</span>${value}</p>`).join("");

      mediaText.textContent = image || "Ajoute une image au projet";
      mediaText.hidden = false;
      mediaImg.hidden = true;
      if (image) {
        mediaImg.src = image;
        mediaImg.alt = title;
      } else {
        mediaImg.removeAttribute("src");
      }

      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      modal.querySelector(".project-modal__close").focus();
    };

    const closeProjectModal = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      previousFocus?.focus();
    };

    mediaImg.addEventListener("load", () => {
      mediaImg.hidden = false;
      mediaText.hidden = true;
    });
    mediaImg.addEventListener("error", () => {
      mediaImg.hidden = true;
      mediaText.hidden = false;
    });

    projectCards.forEach((card) => {
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.addEventListener("click", () => openProjectModal(card));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProjectModal(card);
        }
      });
    });

    modal.querySelectorAll("[data-modal-close]").forEach((el) => {
      el.addEventListener("click", closeProjectModal);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("open")) closeProjectModal();
    });
  }

  // Copy email
  document.querySelectorAll("[data-copy]").forEach((el) => {
    el.addEventListener("click", () => {
      const text = el.dataset.copy;
      navigator.clipboard.writeText(text);
      const icon = el.querySelector(".icon-btn");
      if (icon) {
        const orig = icon.textContent;
        icon.textContent = "✓ copié";
        icon.classList.add("shown");
        setTimeout(() => { icon.textContent = orig; icon.classList.remove("shown"); }, 1500);
      }
    });
  });
});
