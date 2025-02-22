import { createApp } from './fastify'

const app = createApp()

app.listen({ port: 3000 }).catch((err) => {
  app.log.error(err)
  process.exit(-1)
})
