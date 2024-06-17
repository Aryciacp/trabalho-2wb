## Para começar
Baixe os arquivos do github; <br>
Faça a instalação do `node_modules` por meio do:
```bash
npm install
```
Inicie o servidor:
```bash
npm run dev
```

## Implementação das rotas:
Foi feito a rota **categorias** que permite fazer POST, GET (por id e produtos), PUT e DELETE; <br>
Também a rota **register** que permite criar um novo usuário. Ambas foram feitas dentro do critério de validação e armazenadas no banco de dados **Mongo db**.

-> Para que as rotas sejam conectadas corretamente deve-se criar uma arquivo `.env` com seguintes instruções:

`STAGE = 'dev'`<br>
`PORT = 5000` <br>
`HOST = '127.0.0.1'` <br>
`JWT_SECRET = 'Abcd@1234'` <br>
`DB_URL = 'mongodb://127.0.0.1/dositio'` <br>
