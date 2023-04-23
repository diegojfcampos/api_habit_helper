import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import dayjs from 'dayjs'

async function habitsRoutes(app: FastifyInstance, options: any, done: () => void) { 

  app.get('/testdb', async (request: FastifyRequest, reply: FastifyReply) =>{
    const users = await app.z;
    const check = typeof(users)
    if(!users) reply.send({message: "DB TEST FAIl"})
    reply.send({message: "DB TEST OK", user: users, typeof: check})

  })
  
  app.post('/habits', async (request: FastifyRequest, reply: FastifyReply ) => {
    const createHabitBody = app.z.object({
      title: app.z.string(),
      weekDays: app.z.array(app.z.number().min(0).max(6))
    })
    const { title, weekDays } = createHabitBody.parse(request.body)
    const today = dayjs().startOf('day').toDate()   
    
    const habit = await app.prisma.habit.create({
      data: {
        title,
        createdAt: today,
        weekDays: {
          create: weekDays.map(weekDay => ({ week_day: weekDay }))          
        } 
      }
    })  
    if(!habit) reply.send({message: "Error to create habit"})
    reply.send({message: "Habit Created",status: true, habit})
  })
  
  done()
}

export default habitsRoutes
