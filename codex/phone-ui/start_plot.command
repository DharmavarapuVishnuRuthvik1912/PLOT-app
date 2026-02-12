#!/bin/zsh
set -e
cd "$(dirname "$0")"
python3 server.py >/tmp/plot_server.log 2>&1 &
SERVER_PID=$!
sleep 1
open "http://127.0.0.1:8080/index.html"
echo "PLOT started at http://127.0.0.1:8080/index.html"
echo "Server PID: $SERVER_PID"
echo "Logs: /tmp/plot_server.log"
