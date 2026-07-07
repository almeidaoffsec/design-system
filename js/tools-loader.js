/* ============================================================
   almeidaoffsec — design-system / tools-loader.js
   Renderiza cards de projetos a partir de um JSON central.
   Para adicionar um projeto novo: edite apenas
   design-system/data/tools.json — nenhuma página precisa
   ser tocada manualmente.

   Uso na página:
     <div id="tools-grid" class="grid-3" data-limit="3"></div>
     <script src=".../tools-loader.js"></script>

   data-limit (opcional): número máximo de cards exibidos.
   Omita para mostrar todos os projetos (página /projetos/).

   Suporte bilíngue: description pode ser string (legado) ou
   objeto { pt, en }. O idioma ativo é lido do localStorage.
   ============================================================ */
(function () {
  var DATA_URL = "https://cdn.jsdelivr.net/gh/almeidaoffsec/design-system@main/data/tools.json";

  var cachedTools     = null;
  var cachedLimit     = NaN;
  var cachedContainer = null;
  var currentDict     = {};

  function isInternal(url) {
    try {
      var host = new URL(url).hostname;
      return host === "almeidaoffsec.com" ||
             host.endsWith(".almeidaoffsec.com") ||
             host === "almeidaoffsec.github.io" ||
             host.endsWith(".almeidaoffsec.github.io");
    } catch (e) { return false; }
  }

  function badgeClass(severity) {
    var map = { critical: "badge--critical", medium: "badge--medium", low: "badge--low", info: "badge--info" };
    return map[severity] || "badge--info";
  }

  function getDescription(tool) {
    if (typeof tool.description === "string") return tool.description;
    var lang = localStorage.getItem("lang") || "pt-BR";
    var key  = lang === "en" ? "en" : "pt";
    return (tool.description && (tool.description[key] || tool.description.pt || tool.description.en)) || "";
  }

  function t(key, fallback) {
    return currentDict[key] || fallback;
  }

  function renderCard(tool) {
    var tagsHtml = (tool.tags || [])
      .map(function (tag) { return '<span class="badge ' + badgeClass(tool.severity) + '">' + tag + "</span>"; })
      .join("");
    var toolTarget = isInternal(tool.url) ? "" : ' target="_blank" rel="noopener"';
    return (
      '<div class="card">' +
        "<h3>" + tool.name + "</h3>" +
        "<p>" + getDescription(tool) + "</p>" +
        '<div class="tags">' + tagsHtml + "</div>" +
        '<div class="hero__actions" style="margin-top:1.25rem;">' +
          '<a class="btn-primary" href="' + tool.url + '"' + toolTarget + '>' + t("tool.card.cta", "Ver projeto") + '</a>' +
          '<a class="btn-secondary" href="' + tool.repo + '" target="_blank" rel="noopener">' + t("tool.card.repo", "Repositório") + '</a>' +
        "</div>" +
      "</div>"
    );
  }

  function render() {
    if (!cachedContainer || !cachedTools) return;
    var list = isNaN(cachedLimit) ? cachedTools : cachedTools.slice(0, cachedLimit);
    cachedContainer.innerHTML = list.map(renderCard).join("");
  }

  function init() {
    cachedContainer = document.getElementById("tools-grid");
    if (!cachedContainer) return;
    cachedLimit = parseInt(cachedContainer.getAttribute("data-limit"), 10);
    var url = cachedContainer.getAttribute("data-src") || DATA_URL;

    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (tools) {
        cachedTools = tools;
        render();
      })
      .catch(function () {
        if (cachedContainer) {
          cachedContainer.innerHTML = "<p>Não foi possível carregar os projetos agora. Tente novamente mais tarde.</p>";
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
