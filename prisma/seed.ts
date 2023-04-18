import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {

    await prisma.habit.deleteMany();

    await prisma.habit.create({
        data: {
            title: "Read a book",
            createdAt: new Date("2023-04-18T00:00:00.000Z"),
        },     

    });
 
}

main()
.then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
})
