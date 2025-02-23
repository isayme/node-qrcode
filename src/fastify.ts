import cors from '@fastify/cors'
import { default as Fastify, FastifyReply, FastifyRequest } from 'fastify'
import lodash from 'lodash'
import pino from 'pino'
import { getQrCode } from './qrcode'
import { isCurl } from './util'

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

export function createApp() {
  const app = Fastify({
    logger: {
      timestamp: pino.stdTimeFunctions.isoTime,
      base: null, // remove log fields: pid & hostname
    },
  })
  app.register(cors)

  app.post<{ Body: GetQrCodeReq }>(
    '/qr',
    { schema: { body: GetQrCodeReqSchema } },
    async (request, reply) => {
      await getQrCodeHandler(request, reply, request.body)
    },
  )

  app.get<{ Querystring: GetQrCodeReq }>(
    '/qr',
    { schema: { querystring: GetQrCodeReqSchema } },
    async (request, reply) => {
      await getQrCodeHandler(request, reply, request.query)
    },
  )

  return app
}

export interface GetQrCodeReq {
  text: string
  margin?: number
  width?: number
  scale?: number
  format?: string
  darkColor?: string
  lightColor?: string
}

export async function getQrCodeHandler(
  request: FastifyRequest,
  reply: FastifyReply,
  params: GetQrCodeReq,
) {
  const userAgent = request.headers['user-agent'] || ''

  if (lodash.isEmpty(params.format)) {
    if (isCurl(userAgent)) {
      params.format = 'terminal'
    } else {
      params.format = 'png'
    }
  }

  let resp = await getQrCode(params)
  reply.type(resp.type)
  reply.send(resp.data)
}
