#!/bin/bash
set -e
SRC="$(cd "$(dirname "$0")/../phone-ui" && pwd)"
DST="$(cd "$(dirname "$0")/app/src/main/assets/www" && pwd)"
mkdir -p "$DST"
rsync -av --delete   --exclude '.env'   --exclude '.DS_Store'   --exclude 'RUN.md'   --exclude 'start_plot.command'   --exclude 'STOP_PLOT.command'   --exclude 'server.py'   "$SRC/" "$DST/"
echo "Synced web assets to $DST"
