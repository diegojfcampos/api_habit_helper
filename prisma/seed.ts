// seed.js

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const generateRandomHabit = () => {
  const titles = ["Exercise", "Read", "Meditate", "Write", "Learn"];
  const randomIndex = Math.floor(Math.random() * titles.length);
  return titles[randomIndex];
};

const generateRandomWeekDay = () => {
  return Math.floor(Math.random() * 7) + 1;
};

const generateRandomDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const seed = async () => {
  try {
    for (let i = 0; i < 20; i++) {
      const date = generateRandomDate(i);
      const day = await prisma.day.create({
        data: {
          date: new Date(date),
        },
      });

      for (let j = 0; j < 3; j++) {
        const habit = await prisma.habit.create({
          data: {
            title: generateRandomHabit(),
          },
        });

        await prisma.dayHabit.create({
          data: {
            day: {
              connect: {
                id: day.id,
              },
            },
            habit: {
              connect: {
                id: habit.id,
              },
            },
          },
        });

        const weekDay = generateRandomWeekDay();

        await prisma.habitWeekDays.create({
          data: {
            habit: {
              connect: {
                id: habit.id,
              },
            },
            week_day: weekDay,
          },
        });
      }
    }
    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
