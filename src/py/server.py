from aiohttp import web
import json

async def handle(request):
    body = { 'hand': 1 }
    headers = { 'Content-Type': 'application/javascript' }
    return web.Response(text = json.dumps(body), headers = headers)

app = web.Application()
app.router.add_get('/get-hand', handle)

web.run_app(app, port=3000)
