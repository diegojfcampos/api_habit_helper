import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {

    const firstHabit = await prisma.habit.create({
        data: {
            id: "firstHabitid",
            title: "Read a Documentation",
            createdAt: new Date("2023-01-01T00:00:00.000Z"),
            weekDays: {
                create: [
                    { week_day: 1 },
                    { week_day: 2 }                        
                ]
            }
        }   
    });

    const secondHabit = await prisma.habit.create({
        data: {
            id: "secondHabitid",
            title: "Leetcode exercise",
            createdAt: new Date("2023-01-01T00:00:00.000Z"),
            weekDays: {
                create: [
                    { week_day: 1 },
                    { week_day: 2 },
                    { week_day: 3 },
                    { week_day: 4 },
                ]
            }
        }   
    });

    const thirtdHabit = await   prisma.habit.create({
            data: {
                id: "thirthHabitid",
                title: "Decode a project",
                createdAt: new Date("2023-01-01T00:00:00.000Z"),
                weekDays: {
                    create: [
                        { week_day: 1 },
                        { week_day: 2 },
                        { week_day: 3 },
                        { week_day: 4 },
                        { week_day: 5 },

                    ]
                }
            }   
        });

    const fourthHabit = await prisma.habit.create({
            data: {
                id: "fourthHabitid",
                title: "Sleep 8 hours",
                createdAt: new Date("2023-01-01T00:00:00.000Z"),
                weekDays: {
                    create: [
                        { week_day: 1 },
                        { week_day: 2 },
                        { week_day: 3 },
                        { week_day: 4 },
                        { week_day: 5 },
                        { week_day: 6 },
                        { week_day: 7 },

                    ]
                }
            }   
        }); 

        await prisma.day.create({
            data: {
                date: new Date("2023-02-02T00:00:00.000Z"),
                dayHabits: {
                    create: [
                        { habit_id: firstHabit.id}
                    ]
                }
            }
        }),

        await prisma.day.create({
            data: {
                date: new Date("2023-02-02T00:00:00.000Z"),
                dayHabits: {
                    create: [
                        { habit_id: secondHabit.id}
                    ]
                }
            }
        }),

        await prisma.day.create({
            data: {
                date: new Date("2023-02-02T00:00:00.000Z"),
                dayHabits: {
                    create: [
                        { habit_id: thirtdHabit.id}
                    ]
                }
            }
        }),

        prisma.day.create({
            data: {
                date: new Date("2023-02-02T00:00:00.000Z"),
                dayHabits: {
                    create: [
                        { habit_id: firstHabit.id},
                        { habit_id: secondHabit.id},
                        { habit_id: fourthHabit.id},
                    ]
                }
            }
        }),

        prisma.day.create({
            data: {
                date: new Date("2023-02-02T00:00:00.000Z"),
                dayHabits: {
                    create: [
                        { habit_id: secondHabit.id},
                        { habit_id: thirtdHabit.id},
                        { habit_id: fourthHabit.id},
                    ]
                }
            }
        })    
}

main()
.then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
})
