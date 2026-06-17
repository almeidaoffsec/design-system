# design-system

Fonte única de verdade visual da almeidaoffsec: CSS, JS de header/footer compartilhado, dados de ferramentas e logos. Nenhum outro repositório deve duplicar esses arquivos — todos consomem via CDN.

## Como consumir em qualquer site (Hub, ferramenta, etc.)

```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/almeidaoffsec/design-system@main/css/base.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/almeidaoffsec/design-system@main/css/components.css">
</head>
<body data-page="home">
  <div id="site-header"></div>

  <!-- conteúdo da página -->

  <div id="site-footer"></div>

  <script src="https://cdn.jsdelivr.net/gh/almeidaoffsec/design-system@main/js/site-chrome.js"></script>
</body>
```

## Versionamento do CDN (importante)

`@main` sempre busca a versão mais recente da branch — ótimo enquanto você está construindo e quer que tudo atualize sozinho. Quando o site estiver estável e em produção, troque `@main` por uma tag de versão (ex: `@v1.0.0`) em todos os links, para que uma mudança futura no design-system não quebre sites publicados sem você revisar antes.

jsDelivr cacheia arquivos de branch por ~12-24h. Para forçar atualização imediata depois de um commit, acesse:
`https://purge.jsdelivr.net/gh/almeidaoffsec/design-system@main/css/base.css` (repita para cada arquivo alterado).

## Como adicionar uma ferramenta nova ao site

Edite `data/tools.json` e adicione um objeto novo no array. Não precisa tocar em nenhuma página HTML — a Home e a página `/ferramentas/` puxam esse arquivo automaticamente via `tools-loader.js`.

## Estrutura

```
css/base.css         → reset, variáveis de cor, tipografia
css/components.css   → header, footer, hero, card, badge, botões, terminal-block
js/site-chrome.js    → injeta header/footer e controla o menu mobile
js/tools-loader.js   → renderiza os cards de ferramentas a partir do tools.json
data/tools.json       → lista de ferramentas (editar para adicionar/remover)
assets/logo-light.svg → logo em traço claro — usar sobre fundo escuro (padrão do site)
assets/logo-dark.svg  → logo em traço escuro — usar sobre fundo claro
```
