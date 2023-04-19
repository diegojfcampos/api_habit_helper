
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

async function habitsRoutes(app: FastifyInstance, options: any, done: () => void) {
  app.get('/gethabits', async (request: FastifyRequest, reply: FastifyReply) => {
    const habits = await app.prisma.habit.findMany()
    reply.send(habits)
  })

  done()
}

export default habitsRoutes
