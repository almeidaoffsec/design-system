#!/usr/bin/env bash
#
# purge-cdn.sh — Purga o cache do jsDelivr para arquivos do design-system.
#
# Uso:
#   ./purge-cdn.sh                              # menu interativo de seleção
#   ./purge-cdn.sh --all                        # purga todos os arquivos
#   ./purge-cdn.sh --files js/i18n.js data/education.json   # arquivos específicos
#   ./purge-cdn.sh --dry-run                    # preview de todas as URLs
#   ./purge-cdn.sh v1.0.0                       # purga uma tag/branch específica
#   ./purge-cdn.sh --all --dry-run              # flags combinadas
#
# Requer: bash, curl, git (opcional — só usado para sugerir o hash de fallback)

set -uo pipefail

GH_USER="almeidaoffsec"
GH_REPO="design-system"
REF="main"
DRY_RUN=false
PURGE_ALL=false
MAX_RETRIES=3
RETRY_DELAY=5

# --- parsing de argumentos ---
EXTRA_FILES=()
PARSE_FILES=false

for arg in "$@"; do
  if $PARSE_FILES; then
    EXTRA_FILES+=("$arg")
    continue
  fi
  case "$arg" in
    --help|-h)
      cat <<'EOF'
purge-cdn.sh — Purga o cache do jsDelivr para arquivos do design-system.

USO:
  ./purge-cdn.sh                                    Menu interativo de seleção
  ./purge-cdn.sh --all                              Purga todos os arquivos
  ./purge-cdn.sh --files <arq1> [<arq2> ...]        Purga arquivos específicos
  ./purge-cdn.sh --dry-run                          Preview das URLs sem purgar
  ./purge-cdn.sh [REF]                              Purga usando tag ou branch (padrão: main)

FLAGS:
  --all                   Purga todos os arquivos em css/, js/, data/ e assets/
  --files <arq> ...       Lista de caminhos relativos à raiz do repo (após a flag)
  --dry-run               Exibe as URLs que seriam purgadas sem fazer requisições
  -h, --help              Exibe esta ajuda

EXEMPLOS:
  ./purge-cdn.sh
  ./purge-cdn.sh --all
  ./purge-cdn.sh --files js/education-loader.js data/education.json
  ./purge-cdn.sh v1.0.0 --all
  ./purge-cdn.sh --all --dry-run

STATUS DOS ARQUIVOS:
  [OK]          Purga bem-sucedida
  [THROTTLED]   jsDelivr throttled — cache será limpo automaticamente no reset
  [FAIL]        Falha após 3 tentativas (jsDelivr instável ou fora do ar)

WORKAROUND (quando [FAIL]):
  Substitua @main pelo hash do commit nas URLs do CDN:
  https://cdn.jsdelivr.net/gh/almeidaoffsec/design-system@<hash>/<arquivo>
EOF
      exit 0
      ;;
    --dry-run)  DRY_RUN=true ;;
    --all)      PURGE_ALL=true ;;
    --files)    PARSE_FILES=true ;;
    *)          REF="$arg" ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$ROOT_DIR" || exit 1

TARGET_DIRS=("css" "js" "data" "assets")

ALL_FILES=()
for dir in "${TARGET_DIRS[@]}"; do
  if [[ -d "$dir" ]]; then
    while IFS= read -r -d '' f; do
      ALL_FILES+=("${f#./}")
    done < <(find "$dir" -type f -not -name ".gitkeep" -print0 | sort -z)
  fi
done

if [[ ${#ALL_FILES[@]} -eq 0 ]]; then
  echo "Nenhum arquivo encontrado em ${TARGET_DIRS[*]}. Nada a purgar."
  exit 0
fi

# --- determina quais arquivos purgar ---
if [[ ${#EXTRA_FILES[@]} -gt 0 ]]; then
  FILES=("${EXTRA_FILES[@]}")
elif $PURGE_ALL || $DRY_RUN; then
  FILES=("${ALL_FILES[@]}")
else
  # menu interativo
  echo ""
  echo "Arquivos disponíveis:"
  echo ""
  for i in "${!ALL_FILES[@]}"; do
    printf "  %3d) %s\n" "$((i + 1))" "${ALL_FILES[$i]}"
  done
  echo ""
  echo "Digite os números separados por espaço, ou 'a' para todos:"
  read -rp "> " selection

  FILES=()
  if [[ "$selection" == "a" || "$selection" == "all" ]]; then
    FILES=("${ALL_FILES[@]}")
  else
    for n in $selection; do
      if [[ "$n" =~ ^[0-9]+$ ]] && (( n >= 1 && n <= ${#ALL_FILES[@]} )); then
        FILES+=("${ALL_FILES[$((n - 1))]}")
      else
        echo "Ignorado: '$n' não é um número válido."
      fi
    done
  fi
fi

if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "Nenhum arquivo selecionado."
  exit 0
fi

echo ""
echo "Ref: @${REF}  |  ${#FILES[@]} arquivo(s) a processar"
echo "----------------------------------------"

OK_COUNT=0
THROTTLED_FILES=()
FAIL_FILES=()

for file in "${FILES[@]}"; do
  URL="https://purge.jsdelivr.net/gh/${GH_USER}/${GH_REPO}@${REF}/${file}"

  if $DRY_RUN; then
    echo "[DRY-RUN] $URL"
    continue
  fi

  attempt=1
  result=""
  while (( attempt <= MAX_RETRIES )); do
    response="$(curl -s -w '\n%{http_code}' "$URL")"
    http_code="$(echo "$response" | tail -n1)"
    body="$(echo "$response" | sed '$d')"

    if [[ "$http_code" != "200" ]] || echo "$body" | grep -qi "error\|no available server"; then
      echo "  tentativa ${attempt}/${MAX_RETRIES} falhou para ${file} (HTTP ${http_code}) — aguardando ${RETRY_DELAY}s"
      attempt=$((attempt + 1))
      sleep "$RETRY_DELAY"
      continue
    fi

    if echo "$body" | grep -qE '"throttled"\s*:\s*true'; then
      reset="$(echo "$body" | grep -oE '"throttlingReset"\s*:\s*[0-9]+' | grep -oE '[0-9]+')"
      result="throttled${reset:+ (reset em ${reset}s)}"
    else
      result="ok"
    fi
    break
  done

  case "$result" in
    ok)
      echo "[OK]        $file"
      OK_COUNT=$((OK_COUNT + 1))
      ;;
    throttled*)
      echo "[THROTTLED] $file${result#throttled}"
      OK_COUNT=$((OK_COUNT + 1))
      THROTTLED_FILES+=("$file")
      ;;
    *)
      echo "[FAIL]      $file"
      FAIL_FILES+=("$file")
      ;;
  esac
done

echo "----------------------------------------"
suffix=""
[[ ${#THROTTLED_FILES[@]} -gt 0 ]] && suffix=" (${#THROTTLED_FILES[@]} throttled — cache limpo automaticamente pelo jsDelivr)"
echo "Sucesso: ${OK_COUNT}/${#FILES[@]}${suffix}"

if [[ ${#FAIL_FILES[@]} -gt 0 ]]; then
  echo ""
  echo "Falharam (jsDelivr provavelmente instável ou throttled — tente em alguns minutos):"
  for f in "${FAIL_FILES[@]}"; do
    echo "  - $f"
  done
  echo ""
  echo "Workaround temporário — substitua @${REF} pelo hash do commit:"
  CURRENT_HASH="$(git rev-parse --short HEAD 2>/dev/null || echo '<hash-do-commit>')"
  echo "  https://cdn.jsdelivr.net/gh/${GH_USER}/${GH_REPO}@${CURRENT_HASH}/<arquivo>"
  exit 1
fi

exit 0
