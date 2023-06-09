"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function habitsRoutes(app, options, done) {
    app.post('/habits', async (request, reply) => {
        const createHabitBody = app.z.object({
            title: app.z.string(),
            weekDays: app.z.array(app.z.number().min(0).max(6))
        });
        const { title, weekDays } = createHabitBody.parse(request.body);
        const today = app.dayjs().startOf('day').toDate();
        const habit = await app.prisma.habit.create({
            data: {
                title,
                createdAt: today,
                weekDays: {
                    create: weekDays.map(weekDay => ({ week_day: weekDay }))
                }
            }
        });
        if (!habit)
            reply.send({ message: "Error to create habit" });
        reply.send({ message: "Habit Created", status: true, habit });
    });
    app.get('/day', async (request, reply) => {
        const getDayParams = app.z.object({
            date: app.z.coerce.date()
        });
        const { date } = getDayParams.parse(request.query);
        const parsedDate = app.dayjs(date).startOf('day');
        const weekDay = parsedDate.get('day');
        const possibleHabits = await app.prisma.habit.findMany({
            where: {
                createdAt: {
                    lte: date,
                },
                weekDays: {
                    some: {
                        week_day: weekDay,
                    }
                }
            }
        });
        const day = await app.prisma.day.findUnique({
            where: {
                date: parsedDate.toDate(),
            },
            include: {
                dayHabits: true,
            }
        });
        const completedHabits = day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id;
        }) ?? [];
        if (!possibleHabits)
            reply.send({ status: false, message: "Error to get possible habits at this day" });
        reply.send({ possibleHabits, completedHabits });
    });
    app.patch('/habits/:id/toggle', async (request, reply) => {
        const toogleHabitsParams = app.z.object({
            id: app.z.string().uuid()
        });
        const { id } = toogleHabitsParams.parse(request.params);
        const today = app.dayjs().startOf('day').toDate();
        let day = await app.prisma.day.findUnique({
            where: {
                date: today,
            }
        });
        if (!day) {
            day = await app.prisma.day.create({
                data: {
                    date: today,
                }
            });
        }
        const dayHabit = await app.prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id,
                }
            }
        });
        if (dayHabit) {
            await app.prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id,
                }
            });
        }
        else {
            await app.prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id,
                }
            });
        }
    });
    app.get('/summary', async (request, reply) => {
        const summary = await app.prisma.$queryRaw `
      SELECT 
        D.id, 
        D.date,
        (
          SELECT 
            COUNT(*)
          FROM day_habits DH
          WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT
            COUNT(*)
          FROM habit_week_days HWD
              JOIN habits H ON H.id = HWD.habit_id
          WHERE HWD.week_day = EXTRACT(DOW FROM D.date)
              AND H."createdAt" < D.date::date
        )::integer as amount
      FROM days D;
    `;
        // Convert BigInt values to regular integers
        const formattedSummary = summary.map((item) => ({
            ...item,
            completed: Number(item.completed),
            amount: Number(item.amount)
        }));
        reply.send({ summary: formattedSummary });
    });
    done();
}
exports.default = habitsRoutes;
