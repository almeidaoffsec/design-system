/* ============================================================
   almeidaoffsec — design-system / i18n.js
   Detecta idioma, carrega JSONs do design-system + local,
   mescla e aplica em todos os [data-i18n] da página.

   Uso na página:
     <body data-i18n-src="./i18n/">
     <script src=".../i18n.js"></script>

   data-i18n-src: caminho relativo para a pasta i18n/ local
   da página (ferramenta ou hub). Omitir em páginas que usam
   apenas chaves estruturais do design-system.

   API pública:
     window.i18n.setLang("en" | "pt-BR")
     window.i18n.detectLang() → string
   ============================================================ */
(function () {
  var DS_BASE  = "https://cdn.jsdelivr.net/gh/almeidaoffsec/design-system@main/data/i18n/";
  var SUPPORTED = ["pt-BR", "en"];
  var DEFAULT   = "pt-BR";

  function detectLang() {
    var stored = localStorage.getItem("lang");
    if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    return DEFAULT;
  }

  function load(lang) {
    var src = document.body && document.body.getAttribute("data-i18n-src");

    var dsPromise = fetch(DS_BASE + lang + ".json").then(function (r) {
      if (!r.ok) throw new Error("DS i18n fetch failed: " + r.status);
      return r.json();
    });

    var localPromise = src
      ? fetch(src + lang + ".json")
          .then(function (r) { return r.ok ? r.json() : {}; })
          .catch(function () { return {}; })
      : Promise.resolve({});

    Promise.all([dsPromise, localPromise]).then(function (results) {
      var dict = Object.assign({}, results[0], results[1]);

      var els = document.querySelectorAll("[data-i18n]");
      for (var i = 0; i < els.length; i++) {
        var key = els[i].getAttribute("data-i18n");
        if (dict[key] !== undefined) els[i].textContent = dict[key];
      }

      document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
      document.dispatchEvent(new CustomEvent("i18n:ready", { detail: { lang: lang, dict: dict } }));
    }).catch(function (err) {
      console.warn("[i18n] Falha ao carregar traduções:", err);
    });
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    localStorage.setItem("lang", lang);
    load(lang);
  }

  window.i18n = { setLang: setLang, detectLang: detectLang };

  document.addEventListener("DOMContentLoaded", function () {
    setLang(detectLang());
  });
})();
