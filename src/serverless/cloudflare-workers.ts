import { AutoRouter, withContent } from 'itty-router'
import { getQrCode, GetQrCodeReq } from '../qrcode'

const router = AutoRouter({
  before: [withContent],
})

async function getQrCodeHandler(params: GetQrCodeReq): Promise<Response> {
  let getQrCodeResp = await getQrCode(params)
  return new Response(getQrCodeResp.data, {
    headers: {
      'Content-Type': getQrCodeResp.type,
    },
  })
}

router
  .get('/qr', async (req) => {
    return getQrCodeHandler(req.query)
  })
  .post('/qr', async (req) => {
    return getQrCodeHandler(req.content)
  })
  .all('*', () => {
    return new Response('route not found', {
      status: 404,
    })
  })

export default router
