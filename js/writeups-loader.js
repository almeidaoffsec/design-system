/* ============================================================
   almeidaoffsec — design-system / writeups-loader.js
   Renderiza cards de writeups a partir de um JSON central.
   Para adicionar um writeup novo: edite apenas
   design-system/data/writeups.json — nenhuma página precisa
   ser tocada manualmente.

   Uso na página:
     <div id="writeups-grid" class="grid-2" data-limit="2"></div>
     <script src=".../writeups-loader.js"></script>

   data-limit (opcional): número máximo de cards exibidos.
   Omita para mostrar todos os writeups.
   ============================================================ */
(function () {
  var DATA_URL = "https://cdn.jsdelivr.net/gh/almeidaoffsec/design-system@main/data/writeups.json";

  var cachedWriteups  = null;
  var cachedLimit     = NaN;
  var cachedContainer = null;
  var currentDict     = {};

  var MONTHS_PT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  var MONTHS_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function badgeClass(difficulty) {
    var map = { critical: "badge--critical", medium: "badge--medium", low: "badge--low", info: "badge--info" };
    return map[difficulty] || "badge--info";
  }

  function getDescription(writeup) {
    if (typeof writeup.description === "string") return writeup.description;
    var lang = localStorage.getItem("lang") || "pt-BR";
    var key  = lang === "en" ? "en" : "pt";
    return (writeup.description && (writeup.description[key] || writeup.description.pt || writeup.description.en)) || "";
  }

  function formatDate(dateStr) {
    try {
      var d      = new Date(dateStr + "T00:00:00");
      var lang   = localStorage.getItem("lang") || "pt-BR";
      var months = lang === "en" ? MONTHS_EN : MONTHS_PT;
      return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
    } catch (e) { return dateStr; }
  }

  function t(key, fallback) {
    return currentDict[key] || fallback;
  }

  function renderCard(writeup) {
    var badge    = badgeClass(writeup.difficulty);
    var tagsHtml = (writeup.tags || [])
      .map(function (tag) { return '<span class="badge badge--info">' + tag + "</span>"; })
      .join("");

    return (
      '<div class="card">' +
        '<div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">' +
          '<span class="badge ' + badge + '">' + writeup.difficulty + "</span>" +
          '<span class="label">' + writeup.platform + " · " + formatDate(writeup.date) + "</span>" +
        "</div>" +
        "<h3><a href=\"" + writeup.url + "\">" + writeup.title + "</a></h3>" +
        "<p>" + getDescription(writeup) + "</p>" +
        (tagsHtml ? '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin:1rem 0;">' + tagsHtml + "</div>" : "") +
        '<a class="btn-secondary" href="' + writeup.url + '">' + t("writeup.card.cta", "Ler writeup →") + "</a>" +
      "</div>"
    );
  }

  function sortByDate(list) {
    return list.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  }

  function render() {
    if (!cachedContainer || !cachedWriteups) return;
    var list = sortByDate(cachedWriteups);
    if (!isNaN(cachedLimit)) list = list.slice(0, cachedLimit);
    cachedContainer.innerHTML = list.map(renderCard).join("");
  }

  function init() {
    cachedContainer = document.getElementById("writeups-grid");
    if (!cachedContainer) return;
    cachedLimit = parseInt(cachedContainer.getAttribute("data-limit"), 10);
    var url = cachedContainer.getAttribute("data-src") || DATA_URL;

    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (writeups) {
        cachedWriteups = writeups;
        render();
      })
      .catch(function () {
        if (cachedContainer) {
          cachedContainer.innerHTML = "<p>Não foi possível carregar os writeups agora. Tente novamente mais tarde.</p>";
        }
      });
  }

  /* Re-renderiza cards quando o idioma mudar */
  document.addEventListener("i18n:ready", function (e) {
    currentDict = (e.detail && e.detail.dict) || {};
    render();
  });

  document.addEventListener("DOMContentLoaded", init);
})();
