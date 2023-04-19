import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import prisma from '../../prisma/prismaClient';

const prismaPlugin: FastifyPluginCallback = (fastify: FastifyInstance, opts, done) => {
  fastify.decorate('prisma', prisma);
  done();
};

export default prismaPlugin;