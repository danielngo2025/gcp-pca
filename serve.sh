#!/usr/bin/env bash
# One origin keeps localStorage progress stable — don't vary the port.
set -e
cd "$(dirname "$0")"
PORT=8000
echo "PCA study site → http://localhost:$PORT"
command -v open >/dev/null && (sleep 1 && open "http://localhost:$PORT") &
exec python3 -m http.server "$PORT"
