from mitmproxy import http
from gzip import decompress
from base64 import b64decode
from json import loads
from time import process_time
from re import search
from typing import Union

f = open('logs.md', 'w')

def time_str():
    return f'({process_time()*1000:.3f}s)'

def decode_str(s: str) -> Union[bytes, str]:
    try:
        return s.decode('utf8')
    except:
        return s

def decrypt(text: str) -> str:
    return decompress(b64decode(text)).decode('utf8')

host_blacklist = r'google|brave|app-measurement|talto.com|crashlytics|doubleclick'
path_blacklist = r'/tracker|/analytics'

def response(flow: http.HTTPFlow) -> None:
    if search(host_blacklist, flow.request.host) or search(path_blacklist, flow.request.path):
        return

    # log request
    f.write(f'# http {time_str()}\n\n```http\n')
    f.write(f'{flow.request.method} {flow.request.url} {flow.request.http_version}')
    for [header, value] in flow.request.headers.items(True):
        f.write(f'\n{header}: {value}')

    if len(flow.request.content):
        f.write(f'\n\n{decode_str(flow.request.content)}')

    # log response
    f.write('\n```\n\n```http')
    for [header, value] in flow.response.headers.items(True):
        f.write(f'\n{header}: {value}')

    if len(flow.response.content):
        f.write(f'\n\n{decode_str(flow.response.content)}')
    f.write('\n```\n\n')

    f.flush()

def websocket_message(flow: http.HTTPFlow) -> None:
    assert flow.websocket is not None
    addr = flow.server_conn.address
    url = f'{addr[0]}:{addr[1]}'

    for msg in flow.websocket.messages:
        content = msg.content.decode('utf8')
        f.write(f'# ws{"->" if msg.from_client else "<-"} {time_str()} {url}\n\n```json\n')
        f.write(content)
        f.write('\n```\n\n')

        if '"H4sIA' in content:
            content = content.replace('\n', '\\n')
            data = loads(content[content.index('['):])
            decoded = None

            print(data)
            if len(data) == 2 and type(data[1]) is str:
                decoded = decrypt(data[1])
            elif len(data) == 2 and 'content' in data[1] and type(data[1]['content']) is str:
                decoded = decrypt(data[1]['content'])
            elif len(data) == 2 and 'data' in data[1] and type(data[1]['data']['result'] is str):
                decoded = decrypt(data[1]['data']['result'])

            if decoded:
                f.write(f'```json\n{decoded}\n```\n\n')

        f.flush()
