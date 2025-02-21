import { FastifyReply, FastifyRequest } from 'fastify'
import lodash from 'lodash'
import QRCode from 'qrcode'
import { formatRGBAColor, isCurl } from './util'

export interface GetQrCodeReq {
  text: string
  margin?: number
  width?: number
  scale?: number
  format?: string
  darkColor?: string
  lightColor?: string
}

async function getQrCodeHandler(
  request: FastifyRequest,
  reply: FastifyReply,
  params: GetQrCodeReq,
) {
  let { text, width, margin = 2, scale, format, darkColor, lightColor } = params

  const userAgent = request.headers['user-agent'] || ''

  if (lodash.isEmpty(format)) {
    if (isCurl(userAgent)) {
      format = 'terminal'
    } else {
      format = 'png'
    }
  }

  darkColor = formatRGBAColor(darkColor)
  lightColor = formatRGBAColor(lightColor)

  if (lodash.isEqual(format, 'png')) {
    reply.type('image/png')

    reply.send(
      await QRCode.toBuffer(text, {
        type: 'png',
        width,
        margin,
        scale,
        color: {
          light: lightColor,
          dark: darkColor,
        },
      }),
    )
  } else if (lodash.isEqual(format, 'base64')) {
    reply.send(
      await QRCode.toDataURL(text, {
        type: 'image/jpeg',
        width,
        margin,
        scale,
        color: {
          light: lightColor,
          dark: darkColor,
        },
      }),
    )
  } else if (lodash.isEqual(format, 'svg')) {
    reply.type('image/svg+xml')

    reply.send(
      await QRCode.toString(text, {
        type: 'svg',
        width,
        margin,
        scale,
        color: {
          light: lightColor,
          dark: darkColor,
        },
      }),
    )
  } else if (lodash.isEqual(format, 'terminal')) {
    reply.type('application/octet-stream')
    reply.send(
      await QRCode.toString(text, {
        type: 'terminal',
        width,
        margin,
        scale,
        small: true,
        color: {
          light: lightColor,
          dark: darkColor,
        },
      }),
    )
  } else if (lodash.isEqual(format, 'utf8')) {
    reply.send(
      await QRCode.toString(text, {
        type: 'utf8',
        width,
        margin,
        scale,
        color: {
          light: lightColor,
          dark: darkColor,
        },
      }),
    )
  } else {
    reply.status(400)
    reply.send({
      code: 'BadRequest',
      message: `format '${format}' is not supported`,
    })
  }
}

export const GetQrCodeReqSchema = {
  type: 'object',
  properties: {
    text: { type: 'string' },
    margin: { type: 'number' },
    width: { type: 'number' },
    scale: { type: 'number' },
    format: { type: 'string' },
    darkColor: { type: 'string' },
    lightColor: { type: 'string' },
  },
  required: ['text'],
}
