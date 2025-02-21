import { createApp } from './fastify'

const app = createApp()

// Run the server!
app.listen({ port: 3000 }).catch((err) => {
  app.log.error(err)
  process.exit(-1)
})
