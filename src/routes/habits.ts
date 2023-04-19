
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import {z} from 'zod'

interface RouteInterface{
  app: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply

}

async function habitsRoutes({app, request, reply}: RouteInterface, options: any, done: () => void) {
  app.get('/habits', async () => {
    const habits = await app.prisma.habit.findMany()
    reply.send(habits)
  })

  app.post('/habits', async (request, reply) => {
  })
  
  done()
}

export default habitsRoutes
