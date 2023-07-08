import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

interface SummaryItem {
  id: number;
  date: Date;
  completed: number;
  amount: number;
}

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
          create: weekDays.map(weekDay => { 
            return{
              week_day: weekDay, 
            }
          })
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

    const completedHabits = day?.dayHabits.map(dayHabit => {
      return dayHabit.habit_id    
    }) ?? []

    if(!possibleHabits) reply.send({status: false, message: "Error to get possible habits at this day"})
    reply.send({possibleHabits, completedHabits})
  })

  app.patch('/habits/:id/toggle', async (request: FastifyRequest, reply: FastifyReply) => {
    const toggleHabitsParams = app.z.object({
      id: app.z.string().uuid()
    })
  
    const { id } = toggleHabitsParams.parse(request.params)
  
    const today = app.dayjs().startOf('day').toDate()
  
    let day = await app.prisma.day.findUnique({
      where: {
        date: today,
      }
    })
  
    if (!day) {
      day = await app.prisma.day.create({
        data: {
          date: today,
        }
      })
    }
  
    const dayHabit = await app.prisma.dayHabit.findFirst({
      where: {
        day_id: day.id,
        habit_id: id,
      }
    })
  
    if (dayHabit) {
      await app.prisma.dayHabit.delete({
        where: {
          id: dayHabit.id,
        }
      })
    } else {
      await app.prisma.dayHabit.create({
        data: {
          day: {
            connect: {
              id: day.id,
            }
          },
          habit: {
            connect: {
              id: id,
            }
          },
        }
      })
    }
  })  

  app.get('/summary', async (request: FastifyRequest, reply: FastifyReply) => {
    const summary: SummaryItem[] = await app.prisma.$queryRaw<SummaryItem[]>`
      SELECT 
        D.id, 
        D.date,
        COUNT(DH.habit_id) as completed,
        COUNT(H.id) as amount
      FROM days D
      LEFT JOIN day_habits DH ON DH.day_id = D.id
      LEFT JOIN habits H ON H.id = DH.habit_id
      GROUP BY D.id, D.date;
    `;  
    
    const formattedSummary = summary.map((item) => ({
      ...item,
      completed: Number(item.completed),
      amount: Number(item.amount),
    }));

    reply.send({ summary: formattedSummary });
  });
   
  
  done()
}

export default habitsRoutes
