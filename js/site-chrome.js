/* ============================================================
   almeidaoffsec — design-system / site-chrome.js
   Header e footer únicos, injetados em toda página que incluir
   este script. Editar SÓ aqui propaga para todos os sites.

   Uso na página:
     <div id="site-header"></div>
     ... conteúdo ...
     <div id="site-footer"></div>
     <script src=".../site-chrome.js"></script>

   Para marcar o link ativo do menu, defina no <body>:
     <body data-page="home">      -> Home
     <body data-page="tools">     -> Ferramentas
     <body data-page="writeups">  -> Writeups
     <body data-page="blog">      -> Blog
     <body data-page="about">     -> Sobre
   ============================================================ */
(function () {
  var ASSETS_BASE = "https://cdn.jsdelivr.net/gh/almeidaoffsec/design-system@main/assets";

  var NAV_LINKS = [
    { key: "home",     label: "Home",        href: "https://almeidaoffsec.com/" },
    { key: "tools",    label: "Ferramentas", href: "https://almeidaoffsec.com/ferramentas/" },
    { key: "writeups", label: "Writeups",    href: "https://writeups.almeidaoffsec.com/" },
    { key: "blog",     label: "Blog",        href: "https://blog.almeidaoffsec.com/" },
    { key: "about",    label: "Sobre",       href: "https://almeidaoffsec.com/sobre.html" }
  ];

  var SOCIAL_LINKS = {
    github:     "https://github.com/almeidaoffsec",
    linkedin:   "https://www.linkedin.com/in/almeidaoffsec/",
    tryhackme:  "https://tryhackme.com/p/almeidaoffsec",
    youtube:    "https://www.youtube.com/@almeidaoffsec",
    instagram:  "https://www.instagram.com/almeidaoffsec/",
    tiktok:     "https://www.tiktok.com/@almeidaoffsec",
    email:      "mailto:contato@almeidaoffsec.com"
  };

  var ICON_GITHUB    = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.7 1.25 3.36.95.1-.74.39-1.25.71-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.21.66.79.55A11.51 11.51 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5z"/></svg>';
  var ICON_LINKEDIN  = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 10.27h-3v-4.5c0-1.07-.02-2.45-1.5-2.45-1.5 0-1.73 1.17-1.73 2.37v4.58h-3v-9h2.88v1.23h.04c.4-.76 1.39-1.56 2.86-1.56 3.06 0 3.45 2.02 3.45 4.64v4.69z"/></svg>';
  var ICON_TRYHACKME = '<svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="monospace" font-weight="700" font-size="11">THM</text></svg>';
  var ICON_YOUTUBE   = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.5s-.23-1.65-.95-2.37c-.91-.95-1.92-.96-2.38-1.01C17.05 3 12 3 12 3s-5.05 0-8.17.12c-.46.05-1.47.06-2.38 1.01C.73 4.85.5 6.5.5 6.5S.27 8.43.27 10.35v1.79c0 1.92.23 3.85.23 3.85s.23 1.65.95 2.37c.91.95 2.1.92 2.63 1.02C5.73 19.62 12 19.73 12 19.73s5.05-.01 8.17-.13c.46-.05 1.47-.06 2.38-1.01.72-.72.95-2.37.95-2.37s.23-1.93.23-3.85v-1.79C23.73 8.43 23.5 6.5 23.5 6.5zM9.73 13.91V7.71l6.45 3.11-6.45 3.09z"/></svg>';
  var ICON_INSTAGRAM = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>';
  var ICON_TIKTOK    = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>';
  var ICON_EMAIL     = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>';

  function buildNavLinks(activeKey) {
    return NAV_LINKS.map(function (item) {
      var current = item.key === activeKey ? ' aria-current="page"' : "";
      return '<li><a href="' + item.href + '"' + current + ' data-i18n="nav.' + item.key + '">' + item.label + "</a></li>";
    }).join("");
  }

  function injectHeader(activeKey) {
    var el = document.getElementById("site-header");
    if (!el) return;
    el.outerHTML =
      '<header class="site-header">' +
        '<div class="container">' +
          '<a class="logo" href="https://almeidaoffsec.com/">' +
            '<img src="' + ASSETS_BASE + '/logo-light.svg" alt="almeidaoffsec">' +
          '</a>' +
          '<nav class="site-nav" id="site-nav">' +
            '<ul class="site-nav__links">' + buildNavLinks(activeKey) + '</ul>' +
            '<div class="site-nav__social">' +
              '<a href="' + SOCIAL_LINKS.github + '" aria-label="GitHub" target="_blank" rel="noopener">' + ICON_GITHUB + '</a>' +
              '<a href="' + SOCIAL_LINKS.linkedin + '" aria-label="LinkedIn" target="_blank" rel="noopener">' + ICON_LINKEDIN + '</a>' +
              '<a href="' + SOCIAL_LINKS.tryhackme + '" aria-label="TryHackMe" target="_blank" rel="noopener">' + ICON_TRYHACKME + '</a>' +
              '<button class="lang-toggle" id="lang-toggle" aria-label="Switch language">EN</button>' +
            '</div>' +
          '</nav>' +
          '<button class="nav-toggle" id="nav-toggle" aria-label="Abrir menu" aria-expanded="false">' +
            '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>' +
          '</button>' +
        '</div>' +
      '</header>';

    var toggle = document.getElementById("nav-toggle");
    var nav    = document.getElementById("site-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var isOpen = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    var langToggle = document.getElementById("lang-toggle");
    if (langToggle) {
      langToggle.addEventListener("click", function () {
        var current = localStorage.getItem("lang") || "pt-BR";
        var next    = current === "en" ? "pt-BR" : "en";
        if (window.i18n) window.i18n.setLang(next);
      });
    }
  }

  function injectFooter() {
    var el = document.getElementById("site-footer");
    if (!el) return;
    var year = new Date().getFullYear();
    el.outerHTML =
      '<footer class="site-footer">' +
        '<div class="container">' +
          '<span class="site-footer__copy">&copy; ' + year + ' almeidaoffsec — Offensive Security</span>' +
          '<ul class="site-footer__links">' +
            '<li><a href="https://almeidaoffsec.com/ferramentas/" data-i18n="footer.link.tools">Ferramentas</a></li>' +
            '<li><a href="https://writeups.almeidaoffsec.com/" data-i18n="footer.link.writeups">Writeups</a></li>' +
            '<li><a href="https://blog.almeidaoffsec.com/" data-i18n="footer.link.blog">Blog</a></li>' +
          '</ul>' +
          '<div class="site-footer__social">' +
            '<a href="' + SOCIAL_LINKS.github + '" aria-label="GitHub" target="_blank" rel="noopener">' + ICON_GITHUB + '</a>' +
            '<a href="' + SOCIAL_LINKS.linkedin + '" aria-label="LinkedIn" target="_blank" rel="noopener">' + ICON_LINKEDIN + '</a>' +
            '<a href="' + SOCIAL_LINKS.tryhackme + '" aria-label="TryHackMe" target="_blank" rel="noopener">' + ICON_TRYHACKME + '</a>' +
            '<a href="' + SOCIAL_LINKS.youtube + '" aria-label="YouTube" target="_blank" rel="noopener">' + ICON_YOUTUBE + '</a>' +
            '<a href="' + SOCIAL_LINKS.instagram + '" aria-label="Instagram" target="_blank" rel="noopener">' + ICON_INSTAGRAM + '</a>' +
            '<a href="' + SOCIAL_LINKS.tiktok + '" aria-label="TikTok" target="_blank" rel="noopener">' + ICON_TIKTOK + '</a>' +
            '<a href="' + SOCIAL_LINKS.email + '" aria-label="E-mail">' + ICON_EMAIL + '</a>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  /* Atualiza label do toggle e aria-label quando i18n:ready disparar */
  document.addEventListener("i18n:ready", function (e) {
    var toggle = document.getElementById("lang-toggle");
    if (!toggle) return;
    var label = e.detail.lang === "en" ? "PT" : "EN";
    toggle.textContent = label;
    toggle.setAttribute("aria-label", "Switch to " + (e.detail.lang === "en" ? "Portuguese" : "English"));
  });

  document.addEventListener("DOMContentLoaded", function () {
    var activeKey = document.body.getAttribute("data-page") || "home";
    injectHeader(activeKey);
    injectFooter();
  });
})();
