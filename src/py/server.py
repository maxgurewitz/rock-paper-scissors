from aiohttp import web
import json
import aiohttp_cors

async def handle(request):
    body = { 'hand': 1 }
    headers = { 'Content-Type': 'application/javascript' }
    return web.Response(text=json.dumps(body), headers=headers)

app = web.Application()

cors = aiohttp_cors.setup(app)

cors.add(app.router.add_get('/api/get-hand', handle))

web.run_app(app, port=3000)
