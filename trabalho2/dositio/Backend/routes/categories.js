import fastify from 'fastify';
import createError from '@fastify/error';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authPlugin from './auth.js'; 

dotenv.config();
const MyCustomError = createError('MyCustomError', 'Something went wrong.', 500);

const app = fastify();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mylibrary';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

let booksCollection;

app.register(async (instance, opts) => {
    try {
        await client.connect();
        const db = client.db();
        booksCollection = db.collection('books');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
});

// Registrar o plugin de autenticação
app.register(authPlugin);

app.get('/books', async (request, reply) => {
    const books = await booksCollection.find().toArray();
    return books;
});

app.get('/books/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    const book = await booksCollection.findOne({ id });
    if (!book) {
        throw new MyCustomError('Book not found.', 404);
    }
    return book;
});

app.post('/books', async (request, reply) => {
    const { title, author } = request.body;
    const id = await getNextSequenceValue('bookId');
    const newBook = { id, title, author };
    await booksCollection.insertOne(newBook);
    return reply.code(201).send(newBook);
});

app.put('/books/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    const { title, author } = request.body;
    const result = await booksCollection.updateOne({ id }, { $set: { title, author } });
    if (result.modifiedCount === 0) {
        throw new MyCustomError('Book not found.', 404);
    }
    return reply.code(204).send();
});

app.delete('/books/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    const result = await booksCollection.deleteOne({ id });
    if (result.deletedCount === 0) {
        throw new MyCustomError('Book not found.', 404);
    }
    return reply.code(204).send();
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

async function getNextSequenceValue(sequenceName) {
    const result = await client.db().collection('counters').findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { sequence_value: 1 } },
        { returnOriginal: false }
    );
    return result.value.sequence_value;
}

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, (err) => {
    if (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
    console.log(`Server listening on http://${HOST}:${PORT}`);
});