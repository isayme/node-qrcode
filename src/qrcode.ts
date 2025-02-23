import lodash from 'lodash'
import QRCode from 'qrcode'
import { formatRGBAColor, toNumber } from './util'

export interface GetQrCodeReq {
  text: string
  margin?: number
  width?: number
  scale?: number
  format?: string
  darkColor?: string
  lightColor?: string
}

export interface GetQrCodeResp {
  type: string
  data: any
}

export async function getQrCode(params: GetQrCodeReq): Promise<GetQrCodeResp> {
  let { text, width, margin, scale, format, darkColor, lightColor } = params

  width = toNumber(width)
  margin = toNumber(margin)
  scale = toNumber(scale)

  margin = margin || 2

  darkColor = formatRGBAColor(darkColor)
  lightColor = formatRGBAColor(lightColor)

  let resp: GetQrCodeResp = { type: '', data: '' }

  if (lodash.isEqual(format, 'base64')) {
    resp.type = 'text/plain'
    resp.data = await QRCode.toDataURL(text, {
      type: 'image/jpeg',
      width,
      margin,
      scale,
      color: {
        light: lightColor,
        dark: darkColor,
      },
    })
  } else if (lodash.isEqual(format, 'png')) {
    resp.type = 'image/png'
    resp.data = await QRCode.toBuffer(text, {
      type: 'png',
      width,
      margin,
      scale,
      color: {
        light: lightColor,
        dark: darkColor,
      },
    })
  } else if (lodash.isEqual(format, 'terminal')) {
    resp.type = 'application/octet-stream'
    resp.data = await QRCode.toString(text, {
      type: 'terminal',
      width,
      margin,
      scale,
      small: true,
      color: {
        light: lightColor,
        dark: darkColor,
      },
    })
  } else if (lodash.isEqual(format, 'utf8')) {
    resp.type = 'text/plain'
    resp.data = await QRCode.toString(text, {
      type: 'utf8',
      width,
      margin,
      scale,
      color: {
        light: lightColor,
        dark: darkColor,
      },
    })
  } else {
    resp.type = 'image/svg+xml'
    resp.data = await QRCode.toString(text, {
      type: 'svg',
      width,
      margin,
      scale,
      color: {
        light: lightColor,
        dark: darkColor,
      },
    })
  }

  return resp
}
