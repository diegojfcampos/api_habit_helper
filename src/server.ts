import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

const app: FastifyInstance = fastify({ logger: true, ajv: { customOptions: {coerceTypes: true}}});

const start = async () => {
   try{
     app.register(require('@fastify/cors'), {
           origin: true,
           methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
           allowedHeaders: ['Content-Type', 'Authorization']
     });

     app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
          reply.send({ Server_Status: 'Running' });
     });

     app.register(require("./routes/habits"), { prefix: '/api/v1' });

     app.listen(3333);
             
   }catch(err){
     app.log.error(err);
     process.exit(1);
   }
}

start();
