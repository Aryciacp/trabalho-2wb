import fastify from 'fastify';
import createError from '@fastify/error';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

const InvalidGenreError = createError('InvalidGenreError', 'Gênero inválido.', 400);

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mylibrary';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

let genresCollection;

app.register(async (instance, opts) => {
    try {
        await client.connect();
        const db = client.db();
        genresCollection = db.collection('genres');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
});

app.get('/genres', async (request, reply) => {
    try {
        const genres = await genresCollection.find().toArray();
        return genres;
    } catch (error) {
        request.log.error({ error });
        throw new InvalidGenreError();
    }
});

app.post('/genres', {
    schema: {
        body: {
            type: 'object',
            properties: {
                name: { type: 'string' }
            },
            required: ['name']
        }
    }
}, async (request, reply) => {
    try {
        const { name } = request.body;
        const newGenre = { name };
        const result = await genresCollection.insertOne(newGenre);
        return reply.code(201).send(result.ops[0]);
    } catch (error) {
        request.log.error({ error });
        throw new InvalidGenreError();
    }
});

app.get('/genres/:id', async (request, reply) => {
    try {
        const genre = await genresCollection.findOne({ _id: request.params.id });
        if (!genre) {
            throw new InvalidGenreError();
        }
        return genre;
    } catch (error) {
        request.log.error({ error });
        throw new InvalidGenreError();
    }
});

app.put('/genres/:id', {
    schema: {
        body: {
            type: 'object',
            properties: {
                name: { type: 'string' }
            },
            required: ['name']
        }
    }
}, async (request, reply) => {
    try {
        const { name } = request.body;
        const result = await genresCollection.updateOne({ _id: request.params.id }, { $set: { name } });
        if (result.modifiedCount === 0) {
            throw new InvalidGenreError();
        }
        return reply.code(204).send();
    } catch (error) {
        request.log.error({ error });
        throw new InvalidGenreError();
    }
});

app.delete('/genres/:id', async (request, reply) => {
    try {
        const result = await genresCollection.deleteOne({ _id: request.params.id });
        if (result.deletedCount === 0) {
            throw new InvalidGenreError();
        }
        return reply.code(204).send();
    } catch (error) {
        request.log.error({ error });
        throw new InvalidGenreError();
    }
});

app.setErrorHandler(async (error, request, reply) => {
    const { validation } = error;
    request.log.error({ error });
    reply.code(error.statusCode || 500);
    return validation ? `Validation Error: ${validation[0].message}.` : 'Internal Server Error';
});

app.setNotFoundHandler(async (request, reply) => {
    reply.code(404);
    return 'Resource not found.';
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, (err) => {
    if (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
    console.log(`Server listening on http://${HOST}:${PORT}`);
});