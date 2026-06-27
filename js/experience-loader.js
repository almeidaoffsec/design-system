/* ============================================================
   almeidaoffsec — design-system / experience-loader.js
   Renderiza cards de experiência a partir de um JSON central.
   Para adicionar uma experiência: edite apenas
   design-system/data/experience.json — nenhuma página precisa
   ser tocada manualmente.

   Uso na página:
     <div id="experience-grid" class="grid-2"></div>
     <script src=".../experience-loader.js"></script>

   Schema de cada entrada em experience.json:
   {
     "title":        "Nome da plataforma ou função",
     "organization": "Empresa / plataforma",
     "duration":     "Jan 2023 – presente",
     "status":       "active" | "former",
     "description":  { "pt": "...", "en": "..." },
     "tags":         ["Tag1", "Tag2"],
     "logo":         "assets/experience/org.svg" | null,
     "org_url":      "https://..." | null,
     "url":          "https://..." | null
   }
   ============================================================ */
(function () {
  var DATA_URL    = "https://cdn.jsdelivr.net/gh/almeidaoffsec/design-system@main/data/experience.json";
  var ASSETS_BASE = "https://cdn.jsdelivr.net/gh/almeidaoffsec/design-system@main";

  var cachedEntries   = null;
  var cachedContainer = null;
  var currentDict     = {};

  function t(key, fallback) {
    return currentDict[key] || fallback;
  }

  function statusBadge(status) {
    if (status === "active") {
      return '<span class="badge badge--low">' + t("experience.status.active", "Ativo") + "</span>";
    }
    return '<span class="badge badge--info">' + t("experience.status.former", "Anterior") + "</span>";
  }

  function getDescription(entry) {
    if (typeof entry.description === "string") return entry.description;
    var lang = localStorage.getItem("lang") || "pt-BR";
    var key  = lang === "en" ? "en" : "pt";
    return (entry.description && (entry.description[key] || entry.description.pt || entry.description.en)) || "";
  }

  function renderCard(entry) {
    var tagsHtml = (entry.tags || [])
      .map(function (tag) { return '<span class="badge badge--info">' + tag + "</span>"; })
      .join("");

    var ctaHtml =
      (entry.org_url
        ? '<a class="btn-secondary" href="' + entry.org_url + '" target="_blank" rel="noopener">' +
            t("experience.card.org", "Ver plataforma →") +
          "</a>"
        : "") +
      (entry.url
        ? '<a class="btn-secondary" href="' + entry.url + '" target="_blank" rel="noopener">' +
            t("experience.card.cta", "Ver perfil →") +
          "</a>"
        : "");

    var metaHtml =
      '<div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">' +
        statusBadge(entry.status) +
        '<span class="label">' + entry.organization + " · " + entry.duration + "</span>" +
      "</div>";

    var bodyHtml =
      metaHtml +
      "<h3>" + entry.title + "</h3>" +
      "<p>" + getDescription(entry) + "</p>" +
      (tagsHtml ? '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin:1rem 0;">' + tagsHtml + "</div>" : "") +
      (ctaHtml ? '<div style="display:flex;flex-wrap:wrap;gap:0.75rem;margin-top:1rem;">' + ctaHtml + "</div>" : "");

    if (entry.logo) {
      return (
        '<div class="card" style="padding:0;overflow:hidden;">' +
          '<div style="background:var(--color-void);display:flex;align-items:center;justify-content:center;padding:2rem;min-height:12rem;">' +
            '<img src="' + ASSETS_BASE + "/" + entry.logo + '" alt="' + entry.organization + '" ' +
              'style="max-height:8rem;max-width:80%;object-fit:contain;">' +
          "</div>" +
          '<div style="padding:1.5rem;">' + bodyHtml + "</div>" +
        "</div>"
      );
    }

    return '<div class="card">' + bodyHtml + "</div>";
  }

  function render() {
    if (!cachedContainer || !cachedEntries) return;
    cachedContainer.innerHTML = cachedEntries.map(renderCard).join("");
  }

  function init() {
    cachedContainer = document.getElementById("experience-grid");
    if (!cachedContainer) return;
    var url = cachedContainer.getAttribute("data-src") || DATA_URL;

    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (entries) {
        cachedEntries = entries;
        render();
      })
      .catch(function () {
        if (cachedContainer) {
          cachedContainer.innerHTML = "<p>Não foi possível carregar as experiências agora. Tente novamente mais tarde.</p>";
        }
      });
  }

  document.addEventListener("i18n:ready", function (e) {
    currentDict = (e.detail && e.detail.dict) || {};
    render();
  });

  document.addEventListener("DOMContentLoaded", init);
})();
