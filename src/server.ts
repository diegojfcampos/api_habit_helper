import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {z} from 'zod'
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    z: typeof z;
  }
}

const app: FastifyInstance = fastify({ logger: true, ajv: { customOptions: {coerceTypes: true}}});

const start = async () => {
   try{
     app.register(require('@fastify/cors'), {
           origin: true,
           methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
           allowedHeaders: ['Content-Type', 'Authorization']
     });

     /*
     Register Plugins
     */
    
     const  sqlite = app.decorate("prisma", prisma)
     app.log.info("Sqlite OK")
     app.decorate('z', z);
     app.log.info("Zod OK")
     /*
     Register Routes
     */
     app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
          reply.send({ Server_Status: 'Running' });
     });

     app.register(require("./routes/habits"), { prefix: '/api/v1' });     

     app.listen({port: 3333});
             
   }catch(err){
     app.log.error(err);
     process.exit(1);
   }
}

start();
