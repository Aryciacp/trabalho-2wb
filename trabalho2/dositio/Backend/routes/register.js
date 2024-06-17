/** 
 * @typedef {import('fastify').FastifyInstance} FastifyInstance 
 */

import auth from './auth.js';

/**
 * @param {FastifyInstance} app - 
 * @param {*} options - 
 */
export default async function register(app, options) {
    const users = app.mongo.db.collection('users');

    app.post('/register', { schema: userSchema, config: { requireAuthentication: false } }, async (request, reply) => {
        await registerUser(users, request.body);
        return reply.code(201).send();
    });
}


const userSchema = {
    body: {
        type: 'object',
        properties: {
            username: { type: 'string' },
            password: { type: 'string' } 
        },
        required: ['username', 'password']
    }
};

/**
 * @param {*} users 
 * @param {*} userData 
 * @returns {Promise<void>} 
 */
async function registerUser(users, userData) {
    await users.insertOne(userData);
}