# almeidaoffsec — guia de frontend

Instruções para criação de páginas web alinhadas com a identidade visual da marca.

---

## 1. Paleta de cores

### Variáveis CSS obrigatórias

Declare sempre no `:root` do seu projeto:

```css
:root {
  /* Backgrounds */
  --color-void:        #0A0E1A; /* fundo principal */
  --color-deep-navy:   #0D1B2A; /* superfícies, cards */
  --color-canvas:      #F7F9FC; /* versão light */
  --color-signal:      #EAECF0; /* textos sobre fundo escuro */

  /* Primárias */
  --color-scan-blue:   #4A9EFF; /* interatividade, links, UI */
  --color-terminal:    #00E5C8; /* acento principal — use com moderação */

  /* Estado / alerta */
  --color-vuln-red:    #FF4D6D; /* criticidade alta */
  --color-warning:     #FFB347; /* criticidade média */
  --color-access-ok:   #39D353; /* sucesso, acesso autorizado */
  --color-recon:       #7B61FF; /* fase de reconhecimento, info */

  /* Texto */
  --color-text-primary:   #EAECF0;
  --color-text-secondary: #8A96A8;
  --color-text-muted:     #4A5568;
}
```

### Regra 60-30-10

| Proporção | Cor | Uso |
|-----------|-----|-----|
| 60% | `--color-void` + `--color-deep-navy` | Fundo de página, seções, containers |
| 30% | `--color-scan-blue` + branco | Textos, títulos, bordas, UI |
| 10% | `--color-terminal` | CTAs, destaques, métricas, hover states |

> **Nunca use `--color-terminal` como cor de fundo de seções inteiras.** Ela perde impacto quando usada em excesso.

---

## 2. Tipografia

### Stack de fontes

```css
/* Importe no <head> */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --font-display: 'Space Grotesk', sans-serif; /* títulos, nome da marca */
  --font-body:    'Inter', sans-serif;          /* corpo de texto, UI */
  --font-code:    'JetBrains Mono', monospace;  /* comandos, payloads, output */
}
```

### Escala tipográfica

```css
h1 { font-family: var(--font-display); font-size: 2.5rem;  font-weight: 700; letter-spacing: -0.02em; }
h2 { font-family: var(--font-display); font-size: 1.75rem; font-weight: 700; letter-spacing: -0.01em; }
h3 { font-family: var(--font-display); font-size: 1.25rem; font-weight: 500; }
p  { font-family: var(--font-body);    font-size: 1rem;    font-weight: 400; line-height: 1.7; }

.label {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.code-block {
  font-family: var(--font-code);
  font-size: 0.875rem;
  color: var(--color-terminal);
  background: var(--color-void);
  padding: 1rem 1.25rem;
  border-radius: 8px;
  border-left: 3px solid var(--color-terminal);
}
```

> ⚠️ **`.code-block` (acima): descartado por decisão consciente, não implementado no `components.css`.** As demais regras deste bloco (h1–h3, p, `.label`) estão implementadas normalmente. Mantido aqui só como registro histórico da especificação original — não reimplementar sem alinhar antes. Ver `Documentacao.md` (seção 4.3).

---

## 3. Componentes base

### Card padrão

```css
.card {
  background: var(--color-deep-navy);
  border: 0.5px solid rgba(74, 158, 255, 0.15);
  border-radius: 12px;
  padding: 1.5rem;
  transition: border-color 0.2s ease;
}

.card:hover {
  border-color: rgba(74, 158, 255, 0.35);
}
```

### Badge de severidade

```css
.badge {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.04em;
}

.badge--critical { background: rgba(255, 77, 109, 0.15); color: #FF4D6D; border: 1px solid rgba(255, 77, 109, 0.3); }
.badge--medium   { background: rgba(255, 179, 71, 0.15);  color: #FFB347; border: 1px solid rgba(255, 179, 71, 0.3);  }
.badge--low      { background: rgba(57, 211, 83, 0.15);   color: #39D353; border: 1px solid rgba(57, 211, 83, 0.3);   }
.badge--info     { background: rgba(123, 97, 255, 0.15);  color: #7B61FF; border: 1px solid rgba(123, 97, 255, 0.3);  }
```

### Botão primário

```css
.btn-primary {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-void);
  background: var(--color-terminal);
  border: none;
  border-radius: 8px;
  padding: 0.625rem 1.25rem;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.1s ease;
}

.btn-primary:hover  { opacity: 0.88; }
.btn-primary:active { transform: scale(0.98); }

.btn-secondary {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-scan-blue);
  background: transparent;
  border: 0.5px solid rgba(74, 158, 255, 0.4);
  border-radius: 8px;
  padding: 0.625rem 1.25rem;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.btn-secondary:hover {
  background: rgba(74, 158, 255, 0.08);
  border-color: rgba(74, 158, 255, 0.7);
}
```

### Bloco de terminal / código

```html
<div class="terminal-block">
  <div class="terminal-header">
    <span class="terminal-dot" style="background:#FF4D6D"></span>
    <span class="terminal-dot" style="background:#FFB347"></span>
    <span class="terminal-dot" style="background:#39D353"></span>
    <span class="terminal-title">bash</span>
  </div>
  <pre class="terminal-body"><code>$ nmap -sV -p 80,443,8080 target.com</code></pre>
</div>
```

```css
.terminal-block {
  background: var(--color-void);
  border: 0.5px solid rgba(74, 158, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.terminal-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: rgba(255,255,255,0.03);
  border-bottom: 0.5px solid rgba(74, 158, 255, 0.1);
}

.terminal-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.terminal-title {
  font-family: var(--font-code);
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-left: auto;
}

.terminal-body {
  padding: 1rem 1.25rem;
  font-family: var(--font-code);
  font-size: 0.875rem;
  color: var(--color-terminal);
  margin: 0;
  line-height: 1.6;
}
```

---

## 4. Layout e grid

```css
.container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }

@media (max-width: 768px) {
  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
}
```

### Espaçamento padrão entre seções

```css
section { padding: 5rem 0; }
section + section { border-top: 0.5px solid rgba(74, 158, 255, 0.08); }
```

---

## 5. Versão light (fundo branco)

Para páginas ou seções em fundo claro, aplique a classe `.theme-light`:

```css
.theme-light {
  --color-void:         #F7F9FC;
  --color-deep-navy:    #EAECF0;
  --color-text-primary: #0D1B2A;
  --color-text-secondary: #4A5568;
  /* terminal e scan-blue permanecem idênticos */
}
```

> O acento `--color-terminal` (#00E5C8) e `--color-scan-blue` (#4A9EFF) **não mudam** entre temas. Isso garante consistência visual entre dark e light — a mesma lógica aplicada nas duas versões da logo.

---

## 6. Logo — regras de uso

### Quando usar cada versão

| Contexto | Versão da logo |
|----------|---------------|
| Fundo escuro (#0A0E1A, #0D1B2A) | `almeidaoffsec_logo.png` (dark) |
| Fundo branco ou claro | `almeidaoffsec_logo_dark.png` (light) |
| Avatar / foto de perfil | Monograma "A" isolado |
| Favicon | Monograma "A" em 32x32px |

### Espaço de respiro obrigatório

```
Margem mínima ao redor da logo = altura da letra "A" do monograma × 0.5
```

Nunca posicione texto, bordas ou outros elementos dentro dessa margem.

### Tamanhos mínimos

| Uso | Largura mínima |
|-----|---------------|
| Desktop (header) | 140px |
| Mobile (header) | 100px |
| Avatar / ícone | 40px (só monograma) |

### O que nunca fazer

- Não altere as cores da logo para outras fora da paleta
- Não adicione sombra, glow ou efeito neon
- Não use a versão dark sobre fundo branco
- Não distorça a proporção — sempre mantenha aspect ratio travado
- Não coloque a logo sobre imagens sem overlay escuro com pelo menos 70% de opacidade

---

## 7. Regras de interação e microanimações

```css
/* Transições padrão */
:root {
  --transition-fast:   0.15s ease;
  --transition-normal: 0.25s ease;
  --transition-slow:   0.4s ease;
}

/* Hover em links */
a {
  color: var(--color-scan-blue);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover { color: var(--color-terminal); }

> ⚠️ **`.scan-effect` + `@keyframes scan-line` (abaixo): descartado por decisão consciente, não implementado no `components.css`.** As transições padrão e o hover de links deste mesmo bloco estão implementados normalmente. Mantido aqui só como registro histórico da especificação original — não reimplementar sem alinhar antes. Ver `Documentacao.md` (seção 4.3).

/* Efeito de scan — use em elementos de destaque */
@keyframes scan-line {
  0%   { transform: translateY(-100%); opacity: 0; }
  50%  { opacity: 0.6; }
  100% { transform: translateY(100%); opacity: 0; }
}

.scan-effect::after {
  content: '';
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: var(--color-terminal);
  animation: scan-line 2s ease-in-out infinite;
}
```

---

## 8. Checklist antes de publicar

Antes de subir qualquer página nova, verifique:

- [ ] Fundo principal é `--color-void` ou `--color-deep-navy`
- [ ] Textos usam `--color-text-primary` ou `--color-text-secondary` — nunca `#fff` hardcoded
- [ ] `--color-terminal` aparece em no máximo 10% da área visível
- [ ] Todos os blocos de código usam `var(--font-code)` e cor `--color-terminal`
- [ ] Badges de severidade seguem o sistema de cores de estado (não decorativo)
- [ ] Logo usa a versão correta para o fundo
- [ ] Página tem versão mobile testada em 375px
- [ ] Nenhum gradiente purple/pink genérico foi usado
- [ ] Fontes carregam via Google Fonts com `display=swap`
- [ ] Contraste de texto passa WCAG AA (mínimo 4.5:1)

---

*Manual gerado para almeidaoffsec — Offensive Security*
*Versão 1.0 — identidade visual aprovada*
