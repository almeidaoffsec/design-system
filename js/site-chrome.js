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
    linkedin: "https://www.linkedin.com/in/SEU-USUARIO/",
    github:   "https://github.com/almeidaoffsec"
  };

  var ICON_LINKEDIN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 10.27h-3v-4.5c0-1.07-.02-2.45-1.5-2.45-1.5 0-1.73 1.17-1.73 2.37v4.58h-3v-9h2.88v1.23h.04c.4-.76 1.39-1.56 2.86-1.56 3.06 0 3.45 2.02 3.45 4.64v4.69z"/></svg>';
  var ICON_GITHUB = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.7 1.25 3.36.95.1-.74.39-1.25.71-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.21.66.79.55A11.51 11.51 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5z"/></svg>';

  function buildNavLinks(activeKey) {
    return NAV_LINKS.map(function (item) {
      var current = item.key === activeKey ? ' aria-current="page"' : "";
      return '<li><a href="' + item.href + '"' + current + ">" + item.label + "</a></li>";
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
              '<a href="' + SOCIAL_LINKS.linkedin + '" aria-label="LinkedIn" target="_blank" rel="noopener">' + ICON_LINKEDIN + '</a>' +
              '<a href="' + SOCIAL_LINKS.github + '" aria-label="GitHub" target="_blank" rel="noopener">' + ICON_GITHUB + '</a>' +
            '</div>' +
          '</nav>' +
          '<button class="nav-toggle" id="nav-toggle" aria-label="Abrir menu" aria-expanded="false">' +
            '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>' +
          '</button>' +
        '</div>' +
      '</header>';

    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("site-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var isOpen = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
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
            '<li><a href="https://almeidaoffsec.com/ferramentas/">Ferramentas</a></li>' +
            '<li><a href="https://writeups.almeidaoffsec.com/">Writeups</a></li>' +
            '<li><a href="https://blog.almeidaoffsec.com/">Blog</a></li>' +
          '</ul>' +
          '<div class="site-footer__social">' +
            '<a href="' + SOCIAL_LINKS.linkedin + '" aria-label="LinkedIn" target="_blank" rel="noopener">' + ICON_LINKEDIN + '</a>' +
            '<a href="' + SOCIAL_LINKS.github + '" aria-label="GitHub" target="_blank" rel="noopener">' + ICON_GITHUB + '</a>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  document.addEventListener("DOMContentLoaded", function () {
    var activeKey = document.body.getAttribute("data-page") || "home";
    injectHeader(activeKey);
    injectFooter();
  });
})();
