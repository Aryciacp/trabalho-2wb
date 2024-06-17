import { ALREADY_EXISTS } from "../../../libs/errors.js"; 

/**
 * @param {import('fastify').FastifyInstance} app 
 * @returns {import('fastify').Middleware} 
 */
export const uniqueUser = (app) => async (request, reply) => {
    try {
        const registerUser = app.mongo.db.collection('registerUser');
        const user = request.body;

        const count = await registerUser.countDocuments({ username: user.username });

        if (count > 0) {
            throw new ALREADY_EXISTS();
        }

        return;
    } catch (error) {
        throw error;
    }
};
