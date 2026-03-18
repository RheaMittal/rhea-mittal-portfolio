#!/usr/bin/env python3
"""
Range-request-aware dev server for the portfolio.
Handles video streaming (mov, mp4) correctly so the browser doesn't choke.
Usage: python3 serve.py
"""
import http.server
import os
import re
import sys

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class RangeHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        path = self.translate_path(self.path)
        # If it's a directory, try to serve index.html from it
        if os.path.isdir(path):
            index = os.path.join(path, 'index.html')
            if os.path.isfile(index):
                path = index
            else:
                self.send_error(404)
                return
        if not os.path.isfile(path):
            self.send_error(404)
            return

        file_size = os.path.getsize(path)
        range_header = self.headers.get('Range')

        ctype = self.guess_type(path)
        # Force correct MIME for video files
        if path.endswith('.mov'): ctype = 'video/quicktime'
        elif path.endswith('.mp4'): ctype = 'video/mp4'
        elif path.endswith('.webm'): ctype = 'video/webm'

        if range_header:
            match = re.match(r'bytes=(\d+)-(\d*)', range_header)
            if match:
                start = int(match.group(1))
                end = int(match.group(2)) if match.group(2) else file_size - 1
                end = min(end, file_size - 1)
                length = end - start + 1

                self.send_response(206)
                self.send_header('Content-Type', ctype)
                self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
                self.send_header('Content-Length', str(length))
                self.send_header('Accept-Ranges', 'bytes')
                self.send_header('Cache-Control', 'no-cache')
                self.end_headers()

                try:
                    with open(path, 'rb') as f:
                        f.seek(start)
                        remaining = length
                        while remaining > 0:
                            chunk = f.read(min(65536, remaining))
                            if not chunk:
                                break
                            self.wfile.write(chunk)
                            remaining -= len(chunk)
                except (BrokenPipeError, ConnectionResetError):
                    pass
                return

        self.send_response(200)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(file_size))
        self.send_header('Accept-Ranges', 'bytes')
        self.end_headers()

        try:
            with open(path, 'rb') as f:
                while True:
                    chunk = f.read(65536)
                    if not chunk:
                        break
                    self.wfile.write(chunk)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def log_message(self, fmt, *args):
        # Suppress the noisy broken pipe stack traces — only show actual requests
        pass

    def log_request(self, code='-', size='-'):
        print(f'  {code}  {self.path}')


if __name__ == '__main__':
    os.chdir(DIRECTORY)
    handler = RangeHTTPRequestHandler
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    with http.server.ThreadingHTTPServer(('', PORT), handler) as httpd:
        print(f'\n  Portfolio running at http://localhost:{PORT}/portfolio-v2.html\n')
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\n  Server stopped.')
            sys.exit(0)
