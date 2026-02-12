#!/bin/zsh
pkill -f "python3 server.py" || true
echo "PLOT server stopped (if it was running)."
