#!/usr/bin/env bash
#
# purge-cdn.sh — Purga o cache do jsDelivr para todos os arquivos do
# design-system consumidos via CDN pelos outros sites (Hub, ferramentas, etc).
#
# Uso:
#   ./purge-cdn.sh                 # purga a ref "main" (padrão)
#   ./purge-cdn.sh v1.0.0          # purga uma tag/branch específica
#   ./purge-cdn.sh --dry-run       # só mostra as URLs, não chama nada
#
# Requer: bash, curl, git (opcional — só usado para sugerir o hash de fallback)

set -uo pipefail

GH_USER="almeidaoffsec"
GH_REPO="design-system"
REF="main"
DRY_RUN=false
MAX_RETRIES=3
RETRY_DELAY=5   # segundos entre tentativas

# --- parsing simples de argumentos ---
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    *) REF="$arg" ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"   # raiz do repositório design-system
cd "$ROOT_DIR" || exit 1

# Pastas cujos arquivos são consumidos via CDN pelos sites.
# README.md e FrontendGuide.md ficam de fora — não são chamados via CDN por nenhuma página.
TARGET_DIRS=("css" "js" "data" "assets")

FILES=()
for dir in "${TARGET_DIRS[@]}"; do
  if [[ -d "$dir" ]]; then
    while IFS= read -r -d '' f; do
      FILES+=("${f#./}")
    done < <(find "$dir" -type f -print0)
  fi
done

if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "Nenhum arquivo encontrado em ${TARGET_DIRS[*]}. Nada a purgar."
  exit 0
fi

echo "Ref: @${REF}  |  ${#FILES[@]} arquivo(s) a processar"
echo "----------------------------------------"

OK_COUNT=0
FAIL_FILES=()

for file in "${FILES[@]}"; do
  URL="https://purge.jsdelivr.net/gh/${GH_USER}/${GH_REPO}@${REF}/${file}"

  if $DRY_RUN; then
    echo "[DRY-RUN] $URL"
    continue
  fi

  attempt=1
  success=false
  while [[ $attempt -le $MAX_RETRIES ]]; do
    response="$(curl -s -w '\n%{http_code}' "$URL")"
    http_code="$(echo "$response" | tail -n1)"
    body="$(echo "$response" | sed '$d')"

    if [[ "$http_code" == "200" ]] && ! echo "$body" | grep -qi "error\|no available server"; then
      success=true
      break
    fi

    echo "  tentativa ${attempt}/${MAX_RETRIES} falhou para ${file} (HTTP ${http_code}) — aguardando ${RETRY_DELAY}s"
    attempt=$((attempt + 1))
    sleep "$RETRY_DELAY"
  done

  if $success; then
    echo "[OK]   $file"
    OK_COUNT=$((OK_COUNT + 1))
  else
    echo "[FAIL] $file"
    FAIL_FILES+=("$file")
  fi
done

echo "----------------------------------------"
echo "Sucesso: ${OK_COUNT}/${#FILES[@]}"

if [[ ${#FAIL_FILES[@]} -gt 0 ]]; then
  echo ""
  echo "Falharam (jsDelivr provavelmente instável agora — tente de novo em alguns minutos):"
  for f in "${FAIL_FILES[@]}"; do
    echo "  - $f"
  done
  echo ""
  echo "Workaround temporário (commit pinning) — use o hash do commit atual em vez de @${REF}:"
  CURRENT_HASH="$(git rev-parse --short HEAD 2>/dev/null || echo '<hash-do-commit>')"
  echo "  https://cdn.jsdelivr.net/gh/${GH_USER}/${GH_REPO}@${CURRENT_HASH}/<arquivo>"
  exit 1
fi

exit 0
