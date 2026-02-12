#!/usr/bin/env python3
import json
import os
from urllib.parse import urlencode
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

BASE_DIR = Path(__file__).resolve().parent
TMDB_BASE = 'https://api.themoviedb.org/3'


def load_env(path: Path) -> None:
    if not path.exists():
      return
    for raw in path.read_text(encoding='utf-8').splitlines():
        line = raw.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        key, value = line.split('=', 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


class PlotHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def _json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/health':
            self._json(200, {'ok': True})
            return

        if parsed.path.startswith('/api/'):
            token = os.environ.get('TMDB_READ_TOKEN', '').strip()
            api_key = os.environ.get('TMDB_API_KEY', '').strip()

            # Backward-compatible support:
            # - v4 read token via Authorization header
            # - v3 api_key via query string
            # If TMDB_READ_TOKEN looks like a short v3 key, treat it as api_key.
            if token and len(token) < 60 and not api_key:
                api_key = token
                token = ''

            if not token and not api_key:
                self._json(500, {
                    'error': 'TMDB credentials missing in .env',
                    'hint': 'Set TMDB_READ_TOKEN (v4) or TMDB_API_KEY (v3)'
                })
                return

            tmdb_path = parsed.path[len('/api'):]
            target = f'{TMDB_BASE}{tmdb_path}'
            query = parsed.query
            if api_key:
                separator = '&' if query else ''
                query = f"{query}{separator}{urlencode({'api_key': api_key})}"
            if query:
                target = f'{target}?{query}'

            headers = {'Accept': 'application/json'}
            if token:
                headers['Authorization'] = f'Bearer {token}'
            request = Request(target, headers=headers)

            try:
                with urlopen(request, timeout=8) as response:
                    data = response.read()
                    status = response.status
                    content_type = response.headers.get('Content-Type', 'application/json; charset=utf-8')
                    self.send_response(status)
                    self.send_header('Content-Type', content_type)
                    self.send_header('Content-Length', str(len(data)))
                    self.end_headers()
                    self.wfile.write(data)
                return
            except HTTPError as err:
                body = err.read().decode('utf-8', errors='replace')
                self._json(err.code, {'error': 'TMDB HTTP error', 'status': err.code, 'body': body})
                return
            except URLError as err:
                self._json(502, {'error': 'TMDB network error', 'reason': str(err)})
                return

        return super().do_GET()


if __name__ == '__main__':
    load_env(BASE_DIR / '.env')

    host = os.environ.get('HOST', '127.0.0.1')
    port = int(os.environ.get('PORT', '8080'))

    server = ThreadingHTTPServer((host, port), PlotHandler)
    print(f'PLOT server running at http://{host}:{port}')
    print('Serving static files + TMDB proxy on /api/...')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
