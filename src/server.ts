import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {z} from 'zod'
import { PrismaClient } from "@prisma/client";
const dayjs = require('dayjs')

const prisma = new PrismaClient();


declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    z: typeof z;
    dayjs: typeof dayjs;
  }
}

const app: FastifyInstance = fastify({ logger: true, ajv: { customOptions: {coerceTypes: true}}});

const start = async () => {
   try{

     /*
     Decoratig Fastify with Plugins
     */
     
     //Cors
     app.register(require('@fastify/cors'), {
           origin: true,
           methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
           allowedHeaders: ['Content-Type', 'Authorization']
     });
     app.log.info("Server decorated with @cors")
   
     //Prisma
     app.decorate("prisma", prisma)
     app.log.info("Server decorated with @prisma/sqlite")  

     //Zod
     app.decorate('z', z);
     app.log.info("Server decorated with @zod")

     app.decorate('dayjs', dayjs)
     app.log.info("Server decorated with @dayjs")  

     //Swagger
    app.register(require('@fastify/swagger'), {})
    app.register(require('@fastify/swagger-ui'), {
        routePrefix: '/api/v1/documentation',
        swagger: {
          info: {
            title: 'Habit Helper API',
            description: 'Helping You Achieve a More Productive and Healthier Daily Performance',
            version: '0.1.0'
          },
          schemes: ['http', 'https'],
          consumes: ['application/json'],
          produces: ['application/json'],
          methods: ['GET', 'POST', 'DELETE', 'PUT'] 
        },
        exposeRoute: true
    })    
     app.log.info("Server decorated with @swagger")

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
