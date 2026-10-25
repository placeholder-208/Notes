"""Serve a built site locally with its GitHub Pages base path."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit


class Handler(SimpleHTTPRequestHandler):
    baseurl = '/Notes'

    def do_GET(self):
        path = urlsplit(self.path).path
        if self.baseurl and not path.startswith(self.baseurl + '/'):
            self.send_error(404)
            return
        self.path = self.path[len(self.baseurl):]
        super().do_GET()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--directory', default='_site')
    parser.add_argument('--port', type=int, default=4173)
    parser.add_argument('--baseurl', default='/Notes')
    args = parser.parse_args()
    Handler.baseurl = args.baseurl.rstrip('/')
    server = ThreadingHTTPServer(('127.0.0.1', args.port), partial(Handler, directory=args.directory))
    print(f'Serving http://127.0.0.1:{args.port}{Handler.baseurl}/', flush=True)
    server.serve_forever()
