"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const dayjs = require('dayjs');
const prisma = new client_1.PrismaClient({ log: ['query', 'info', 'warn'] });
const app = (0, fastify_1.default)({ logger: true, ajv: { customOptions: { coerceTypes: true } } });
const start = async () => {
    try {
        /*
        Decoratig Fastify with Plugins
        */
        //Cors
        app.register(require('@fastify/cors'), {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        });
        app.log.info("Server decorated with @cors");
        /*
        //Env
        app.register(require("@fastify/env"))
        //Jwt
        app.register(require("@fastify/jwt"). {
         secret: encodeURIComponent(app.config.SECRET)
        } )
        */
        //Prisma
        app.decorate("prisma", prisma);
        app.log.info("Server decorated with @prisma/sqlite");
        //Zod
        app.decorate('z', zod_1.z);
        app.log.info("Server decorated with @zod");
        app.decorate('dayjs', dayjs);
        app.log.info("Server decorated with @dayjs");
        //Swagger
        app.register(require('@fastify/swagger'), {});
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
        });
        app.log.info("Server decorated with @swagger");
        /*
        Register Routes
        */
        app.get('/', async (request, reply) => {
            reply.send({ Server_Status: 'Running' });
        });
        app.register(require("./routes/habits"), { prefix: '/api/v1' });
        await app.listen({ host: '0.0.0.0', port: 3000 });
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
