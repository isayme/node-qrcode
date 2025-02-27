import { createApp } from '../fastify'

const app = createApp()

export default async function (req: any, res: any) {
  await app.ready()
  app.server.emit('request', req, res)
}
