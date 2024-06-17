import { test, describe } from 'node:test';
import { equal, deepEqual } from 'node:assert';
import { build, options } from './app.js';
import { request } from 'node:http';

const acces_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwidXNlcm5hbWUiOiJNYXJpYSIsImlhdCI6MTcxMzYyMjU1M30.yMsAtdVodtl_aOLbIV329sZwC24U8MWya70JywyBv4c'

describe('###Tests for Server Configuration', async(t) => {
    test('Testing options configuration file', async (t) => {
        const app = await build(options);

        t.after(async() => {
            await app.close();
        });

        deepEqual(options.stage, 'test');
        deepEqual(options.port, '5000');
        deepEqual(options.host, '127.0.0.1');
        deepEqual(options.jwt_secret, 'Abcd@1234');
        deepEqual(options.db_url, 'mongodb://localhost:27017/dositio');
    });
});

describe('###Tests for Authenticated Routes', async(t) => {
    
    describe('##Success Requests', async(t) => {
        test('# POST /register', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'POST',
                url: '/register',
                body: {
                    "_id": "1R",
                    "username": "Maria",
                    "password": "Abcd@1234",
                    "isAdmin": "true"
                }
            });
            equal(response.statusCode, 201);
        })
        test('# POST /auth', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'POST',
                url: '/auth',
                body: {
                    "_id": "1",
                    "username": "Maria",
                    "password": "Abcd@1234"
                }
            });
            equal(response.statusCode, 201);
        })
        test('# POST /categories', async(t) => {
            const app = await build(options);
    
            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'POST',
                url: '/categories',
                body: {
                    "_id": "2",
                    "name": "Legumes",
                    "img_url": "https://www.google.com/imgres?q=legumes%20imagens&imgurl=https%3A%2F%2Fstatic6.depositphotos.com%2F1064024%2F540%2Fi%2F450%2Fdepositphotos_5408850-stock-photo-assortment-of-fresh-vegetables.jpg&imgrefurl=https%3A%2F%2Fdepositphotos.com%2Fbr%2Fphotos%2Flegumes-coloridos.html&docid=1e3NUXPpNL9e6M&tbnid=fyLEgdnFKudJgM&vet=12ahUKEwjK-InCvNGFAxV0F7kGHS9aAGEQM3oECH4QAA..i&w=600&h=400&hcb=2&ved=2ahUKEwjK-InCvNGFAxV0F7kGHS9aAGEQM3oECH4QAA"
                },
                headers: {
                    "isAdmin": "true",
                    "x-acess-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwidXNlcm5hbWUiOiJNYXJpYSIsImlhdCI6MTcxMzYyMjU1M30.yMsAtdVodtl_aOLbIV329sZwC24U8MWya70JywyBv4c"
                }
            });
            equal(response.statusCode, 201);
        });
        test('# GET /categories', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'GET',
                url: '/categories'
            });
            equal(response.statusCode, 200);
        });
        test('# GET /categories', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'GET',
                url: '/categories/2'
            });

            equal(response.statusCode, 200);
        });
        test('# GET /categories', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'GET',
                url: '/categories/2/products'
            });

            equal(response.statusCode, 200);
        });
        test('# PUT /categories/4', async(t) => {
            const app = await build(options);
    
            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'PUT',
                url: '/categories/4',
                body: {
                    "name": "Podão",
                    "img_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5OhBqlHBfpq8sTg0597CEz54JF9-BDhGW0A&s"
                },
                headers: {
                    "isAdmin": "true",
                    "x-acess-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwidXNlcm5hbWUiOiJNYXJpYSIsImlhdCI6MTcxMzYyMjU1M30.yMsAtdVodtl_aOLbIV329sZwC24U8MWya70JywyBv4c"
                }
            });
            equal(response.statusCode, 204);
        });
        test('# DELETE /categories', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'DELETE',
                url: '/categories/2',
                headers: {
                    "isAdmin": "true",
                    "x-acess-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwidXNlcm5hbWUiOiJNYXJpYSIsImlhdCI6MTcxMzYyMjU1M30.yMsAtdVodtl_aOLbIV329sZwC24U8MWya70JywyBv4c"
                }
            });
            equal(response.statusCode, 204);
        });
        test('# POST /products', async(t) => {
            const app = await build(options);
    
            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'POST',
                url: '/products',
                body: {
                    "_id": "1",
                    "nameProduct": "Suco",
                    "qtd": "65",
                    "category": "Liquidos"
                },
                headers: {
                    "isAdmin": "true",
                    "x-acess-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwidXNlcm5hbWUiOiJNYXJpYSIsImlhdCI6MTcxMzYyMjU1M30.yMsAtdVodtl_aOLbIV329sZwC24U8MWya70JywyBv4c"
                }
            });
            equal(response.statusCode, 201);
        });
        test('# GET /products', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'GET',
                url: '/products'
            });
            equal(response.statusCode, 200);
        });
        test('# GET /products', async(t) => {
            const app = await build(options);
    
            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'GET',
                url: '/products/1'
            });
            equal(response.statusCode, 200);
        });
        test('# PUT /products/1', async(t) => {
            const app = await build(options);
    
            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'PUT',
                url: '/products/1',
                body: {
                    "nameProduct": "Refrigerante",
                    "qtd": "64",
                    "category": "Liquidos"
                },
                headers: {
                    "isAdmin": "true",
                    "x-acess-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwidXNlcm5hbWUiOiJNYXJpYSIsImlhdCI6MTcxMzYyMjU1M30.yMsAtdVodtl_aOLbIV329sZwC24U8MWya70JywyBv4c"
                }
            });
            equal(response.statusCode, 204);
        });
        test('# DELETE /products', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'DELETE',
                url: '/products/1',
                headers: {
                    "isAdmin": "true",
                    "x-acess-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwidXNlcm5hbWUiOiJNYXJpYSIsImlhdCI6MTcxMzYyMjU1M30.yMsAtdVodtl_aOLbIV329sZwC24U8MWya70JywyBv4c"
                }
            });
            equal(response.statusCode, 204);
        });
    });

    // FAZENDO TESTE PARA ERROS:

    describe('##Internal Server Error', async(t) => {

        test('# POST /products', async(t) => {
            const app = await build(options);
    
            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'POST',
                url: '/products',
                body: {
                    "_id": "1",
                    "nameProduct": "Água",
                    "qtd": "290",
                    "category": "Liquidos"
                },
                headers: {
                    "isAdmin": "true",
                    "x-acess-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwidXNlcm5hbWUiOiJNYXJpYSIsImlhdCI6MTcxMzYyMjU1M30.yMsAtdVodtl_aOLbIV329sZwC24U8MWya70JywyBv4c"
                }
            });
            equal(response.statusCode, 500);
        });
        test('# POST /categories', async(t) => {
            const app = await build(options);
    
            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'POST',
                url: '/categories',
                body: {
                    "_id": "2",
                    "name": "Leite e Derivados",
                    "img_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSDawxQt6Q6QSDDbjt--1AGka0kx5qzFl0-Q&s"
                },
                headers: {
                    "isAdmin": "true",
                    "x-acess-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwidXNlcm5hbWUiOiJNYXJpYSIsImlhdCI6MTcxMzYyMjU1M30.yMsAtdVodtl_aOLbIV329sZwC24U8MWya70JywyBv4c"
                }
            });
            equal(response.statusCode, 500);
        });
        test('# POST /register', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'POST',
                url: '/register',
                body: {
                    "_id": "1R",
                    "username": "Rosana",
                    "password": "Abcd@12345",
                    "isAdmin": "true"
                }
            });
            equal(response.statusCode, 500);
        })
    });
});

describe('##Bad Request', async(t) => {

    test('# POST /products', async(t) => {
        const app = await build(options);

        t.after(async() => {
            await app.close();
        });
        const response = await app.inject({
            method: 'POST',
            url: '/products',
            body: {
                "_id": "1",
                "nameProduct": "Água",
                "category": "Liquidos"
            },
            headers: {
                "isAdmin": "true",
                "x-acess-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwidXNlcm5hbWUiOiJNYXJpYSIsImlhdCI6MTcxMzYyMjU1M30.yMsAtdVodtl_aOLbIV329sZwC24U8MWya70JywyBv4c"
            }
        });
        equal(response.statusCode, 400);
    });
    test('# POST /categories', async(t) => {
        const app = await build(options);

        t.after(async() => {
            await app.close();
        });
        const response = await app.inject({
            method: 'POST',
            url: '/categories',
            body: {
                "_id": "1",
                "name": "Leite e Derivados",
            },
            headers: {
                "isAdmin": "true",
                "x-acess-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwidXNlcm5hbWUiOiJNYXJpYSIsImlhdCI6MTcxMzYyMjU1M30.yMsAtdVodtl_aOLbIV329sZwC24U8MWya70JywyBv4c"
            }
        });
        equal(response.statusCode, 400);
    });

    describe('##Unautorized (Invalid Token)', async(t) => {
        test('# POST /products', async(t) => {
            const app = await build(options);
    
            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'POST',
                url: '/products',
                body: {
                    "_id": "6",
                    "nameProduct": "Uva",
                    "qtd": "140",
                    "category": "Frutas"
                },
                headers: {
                    "isAdmin": "true",
                    "x-acess-token": "aeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwidXNlcm5hbWUiOiJNYXJpYSIsImlhdCI6MTcxMzYyMjU1M30.yMsAtdVodtl_aOLbIV329sZwC24U8MWya70JywyBv4c"
                }
            });
            equal(response.statusCode, 401);
        });
        test('# POST /categories', async(t) => {
            const app = await build(options);
    
            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'POST',
                url: '/categories',
                body: {
                    "_id": "1",
                    "name": "Limpeza",
                    "img_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPlCHeLqprNgziZvc4DxTKcPGiisTTtZynYA&s"
                },
                headers: {
                    "isAdmin": "true",
                    "x-acess-token": "aeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwidXNlcm5hbWUiOiJNYXJpYSIsImlhdCI6MTcxMzYyMjU1M30.yMsAtdVodtl_aOLbIV329sZwC24U8MWya70JywyBv4c"
                }
            });
            equal(response.statusCode, 401);
        });
        test('# POST /categories (sem token)', async(t) => {
            const app = await build(options);
    
            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'POST',
                url: '/categories',
                body: {
                    "_id": "1",
                    "name": "Limpeza",
                    "img_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPlCHeLqprNgziZvc4DxTKcPGiisTTtZynYA&s"
                },
                headers: {
                    "isAdmin": "true",
                }
            });
            equal(response.statusCode, 401);
        });
    })
})