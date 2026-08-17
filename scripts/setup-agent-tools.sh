#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

export PATH="${HOME}/.local/bin:${PATH}"

if ! command -v pnpm >/dev/null 2>&1; then
  npm install --global pnpm
fi

if [ -f pnpm-lock.yaml ]; then
  pnpm install --frozen-lockfile
else
  pnpm install
fi

python3 -m pip install --user --upgrade "token-savior-recall[mcp]"

missing=0
for f in \
  .cursor/rules/ponytail.mdc \
  .cursor/rules/caveman.mdc \
  .cursor/skills/ponytail/SKILL.md \
  .cursor/skills/caveman/SKILL.md \
  .cursor/mcp.json
do
  if [ ! -f "$f" ]; then
    echo "missing $f" >&2
    missing=1
  fi
done
if [ "$missing" -ne 0 ]; then
  exit 1
fi

python3 -c "import token_savior, sys; print('token-savior', getattr(token_savior, '__version__', 'ok'))"

if [ -x "${HOME}/.local/bin/ts" ]; then
  "${HOME}/.local/bin/ts" use "$(pwd)" >/dev/null
fi

echo "ponytail, caveman, and token-savior are present"
