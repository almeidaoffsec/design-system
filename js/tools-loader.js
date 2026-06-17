/* ============================================================
   almeidaoffsec — design-system / tools-loader.js
   Renderiza cards de ferramentas a partir de um JSON central.
   Para adicionar uma ferramenta nova: edite apenas
   design-system/data/tools.json — nenhuma página precisa
   ser tocada manualmente.

   Uso na página:
     <div id="tools-grid" class="grid-3" data-limit="3"></div>
     <script src=".../tools-loader.js"></script>

   data-limit (opcional): número máximo de cards exibidos.
   Omita para mostrar todas as ferramentas (página /ferramentas/).
   ============================================================ */
(function () {
  var DATA_URL = "https://cdn.jsdelivr.net/gh/almeidaoffsec/design-system@0ddce44cebe4e1c6971eee25e820d52d09af2a6a/data/tools.json";

  function badgeClass(severity) {
    var map = { critical: "badge--critical", medium: "badge--medium", low: "badge--low", info: "badge--info" };
    return map[severity] || "badge--info";
  }

  function renderCard(tool) {
    var tagsHtml = (tool.tags || [])
      .map(function (t) { return '<span class="badge ' + badgeClass(tool.severity) + '">' + t + "</span>"; })
      .join("");
    return (
      '<div class="card">' +
        "<h3>" + tool.name + "</h3>" +
        "<p>" + tool.description + "</p>" +
        '<div class="tags">' + tagsHtml + "</div>" +
        '<div class="hero__actions" style="margin-top:1.25rem;">' +
          '<a class="btn-primary" href="' + tool.url + '" target="_blank" rel="noopener">Ver ferramenta</a>' +
          '<a class="btn-secondary" href="' + tool.repo + '" target="_blank" rel="noopener">Repositório</a>' +
        "</div>" +
      "</div>"
    );
  }

  function init() {
    var container = document.getElementById("tools-grid");
    if (!container) return;
    var limit = parseInt(container.getAttribute("data-limit"), 10);

    fetch(DATA_URL)
      .then(function (res) { return res.json(); })
      .then(function (tools) {
        var list = isNaN(limit) ? tools : tools.slice(0, limit);
        container.innerHTML = list.map(renderCard).join("");
      })
      .catch(function () {
        container.innerHTML = '<p>Não foi possível carregar as ferramentas agora. Tente novamente mais tarde.</p>';
      });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
