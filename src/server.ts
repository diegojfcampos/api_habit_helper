//Importing
import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import cors from '@fastify/cors';

//Instancing
const app = Fastify();
const prisma = new PrismaClient();

//Registering CORS
app.register(cors);

//Creating Server
app.listen({
    port: 3333
}).then(() =>{
    console.log("API HABIT HELPER RUNNING");
})

//Creating routes
app.get('/gethabits', async () =>{
    const habits = await prisma.habit.findMany();
    return habits
})