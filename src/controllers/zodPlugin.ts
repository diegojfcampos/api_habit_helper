import { FastifyPluginCallback, FastifyRequest, FastifyReply } from 'fastify';
import * as z from 'zod';

declare module 'fastify' {
    interface FastifyInstance {
        z: typeof z;
    }
}

const zodPlugin: FastifyPluginCallback = (fastify, options, done) => {
    fastify.decorate('z', z);
    done();
};

export default zodPlugin;