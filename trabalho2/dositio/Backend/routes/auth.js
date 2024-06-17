import { ACCESS_UNAUTHORIZED } from '../libs/errors.js';

/** @type{import('fastify').FastifyPluginAsync<>} */
export default async function auth(app, options) {
    const authCollection = app.mongo.db.collection('registerUser');

    app.post('/auth', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    username: { type: 'string' },
                    password: { type: 'string' },
                    position: { type: 'string' }
                },
                required: ['username', 'password', 'position']
            }
        }
    }, async (request, reply) => {
        const { username, password } = request.body;

        const user = await authCollection.findOne({ username });

        if (!user || user.password !== password) {
            throw new ACCESS_UNAUTHORIZED();
        }

        request.log.info(`Login for user ${username}`);

        const token = app.jwt.sign({ username, position });

        return {
            'x-access-token': token
        };
    });
}