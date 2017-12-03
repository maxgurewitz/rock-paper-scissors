from aiohttp import web
import json
import aiohttp_cors

async def handle(request):
    body = { 'hand': 2 }
    return web.json_response(body)

app = web.Application()

cors = aiohttp_cors.setup(app)

cors.add(app.router.add_get('/api/get-hand', handle))

web.run_app(app, port=3000)
