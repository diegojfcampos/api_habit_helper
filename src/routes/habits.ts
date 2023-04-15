import { PrismaClient } from '@prisma/client'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

const prisma = new PrismaClient()

async function habitsRoutes(app: FastifyInstance, options: any, done: () => void) {
  app.get('/gethabits', async (request: FastifyRequest, reply: FastifyReply) => {
    const habits = await prisma.habit.findMany()
    reply.send(habits)
  })

  done()
}

export default habitsRoutes
