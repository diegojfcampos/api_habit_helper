import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

async function habitsRoutes(app: FastifyInstance, options: any, done: () => void) { 
  
  app.post('/habits', async (request: FastifyRequest, reply: FastifyReply ) => {
    const createHabitBody = app.z.object({
      title: app.z.string(),
      weekDays: app.z.array(app.z.number().min(0).max(6))
    })
    const { title, weekDays } = createHabitBody.parse(request.body)
    const today = app.dayjs().startOf('day').toDate()   
    
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

  app.get('/day', async (request: FastifyRequest, reply: FastifyReply) => {
    const getDayParams = app.z.object({
      date: app.z.coerce.date()
    })
    const {date} = getDayParams.parse(request.query)

    const parsedDate = app.dayjs(date).startOf('day')
    const weekDay = parsedDate.get('day')

    const possibleHabits = await app.prisma.habit.findMany({
      where:{
        createdAt: {
          lte: date,
        },
        weekDays:{
          some:{
            week_day: weekDay,
          }
        }
      }
    })

    const day = await app.prisma.day.findUnique({
      where:{
        date: parsedDate.toDate(),
      },
      include:{
        dayHabits: true,
      }
    })

    const completedHabits = day?.dayHabits.map(dayHabit => dayHabit.habit_id)

    if(!possibleHabits) reply.send({status: false, message: "Error to get possible habits at this day"})
    reply.send({status: true, possibleHabits, completedHabits})
  })

  
  
  done()
}

export default habitsRoutes
