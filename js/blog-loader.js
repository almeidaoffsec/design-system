/* ============================================================
   almeidaoffsec — design-system / blog-loader.js
   Renderiza cards de posts a partir de um JSON central.
   Para adicionar um post novo: edite apenas
   design-system/data/blog.json — nenhuma página precisa
   ser tocada manualmente.

   Uso na página:
     <div id="blog-grid" class="grid-2" data-limit="2"></div>
     <script src=".../blog-loader.js"></script>

   data-limit (opcional): número máximo de cards exibidos.
   Omita para mostrar todos os posts.
   ============================================================ */
(function () {
  var DATA_URL = "https://cdn.jsdelivr.net/gh/almeidaoffsec/design-system@main/data/blog.json";

  var cachedPosts     = null;
  var cachedLimit     = NaN;
  var cachedContainer = null;
  var currentDict     = {};

  var MONTHS_PT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  var MONTHS_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function getDescription(post) {
    if (typeof post.description === "string") return post.description;
    var lang = localStorage.getItem("lang") || "pt-BR";
    var key  = lang === "en" ? "en" : "pt";
    return (post.description && (post.description[key] || post.description.pt || post.description.en)) || "";
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

  function renderCard(post) {
    var tagsHtml = (post.tags || [])
      .map(function (tag) { return '<span class="badge badge--info">' + tag + "</span>"; })
      .join("");

    return (
      '<div class="card">' +
        '<div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">' +
          (post.category ? '<span class="badge badge--info">' + post.category + "</span>" : "") +
          '<span class="label">' + formatDate(post.date) + "</span>" +
        "</div>" +
        "<h3><a href=\"" + post.url + "\">" + post.title + "</a></h3>" +
        "<p>" + getDescription(post) + "</p>" +
        (tagsHtml ? '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin:1rem 0;">' + tagsHtml + "</div>" : "") +
        '<a class="btn-secondary" href="' + post.url + '">' + t("post.card.cta", "Ler post →") + "</a>" +
      "</div>"
    );
  }

  function sortByDate(list) {
    return list.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  }

  function render() {
    if (!cachedContainer || !cachedPosts) return;
    var list = sortByDate(cachedPosts);
    if (!isNaN(cachedLimit)) list = list.slice(0, cachedLimit);
    cachedContainer.innerHTML = list.map(renderCard).join("");
  }

  function init() {
    cachedContainer = document.getElementById("blog-grid");
    if (!cachedContainer) return;
    cachedLimit = parseInt(cachedContainer.getAttribute("data-limit"), 10);
    var url = cachedContainer.getAttribute("data-src") || DATA_URL;

    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (posts) {
        cachedPosts = posts;
        render();
      })
      .catch(function () {
        if (cachedContainer) {
          cachedContainer.innerHTML = "<p>Não foi possível carregar os posts agora. Tente novamente mais tarde.</p>";
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
