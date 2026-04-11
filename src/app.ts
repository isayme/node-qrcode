import { Hono } from 'hono'
import { cors } from 'hono/cors'
import indexHtml from './index-html'
import { getQrCode, GetQrCodeReq } from './qrcode'
import { isCurl } from './util'

function createApp() {
  const app = new Hono()

  app.use('*', cors())

  app.get('/', (c) => {
    return new Response(indexHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  })

  app.post('/get', async (c) => {
    const params = await c.req.json()
    return getQrCodeHandler(c, params as GetQrCodeReq)
  })

  app.get('/get', async (c) => {
    const params = c.req.query()
    return getQrCodeHandler(c, params as unknown as GetQrCodeReq)
  })

  return app
}

async function getQrCodeHandler(c: any, params: GetQrCodeReq) {
  const userAgent = c.req.header('user-agent') || ''

  if (!params.format) {
    if (isCurl(userAgent)) {
      params.format = 'terminal'
    }
  }

  const resp = await getQrCode(params)
  return new Response(resp.data, {
    headers: {
      'Content-Type': resp.type,
    },
  })
}

export default createApp()