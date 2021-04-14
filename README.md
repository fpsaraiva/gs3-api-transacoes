# gs3-api-transacoes

## 💻 Projeto

API REST de operações CRUD que simulam a gestão de usuários e suas transações financeiras.

## 🚀 Tecnologias

- [JavaScript ES6+](https://github.com/topics/js)
- [Node.js](https://github.com/topics/node)
- Yarn

## :sparkles: Endpoints

- recurso USERS
```
POST /users
GET /users/:id
GET /users
PUT /users/:id
DELETE /users/:id
```

- recurso TRANSACTIONS
```
POST /user/:id/transactions
GET /user/:userId/transactions/:transactionId
GET /users/:id/transactions
PUT /users/:userId/transactions/:transactionId
DELETE /users/:userId/transactions/:transactionId
```

## :runner: Como rodar o projeto

- Clonar este repositório
```
git clone https://github.com/fpsaraiva/gs3-api-transacoes.git
```

- Instalar as dependências
```
yarn install
```

- Rodar em ambiente de desenvolvimento
```
yarn dev
```

## :construction: Ideias de melhorias

- Verificar possibilidade de transformar validações internas dos métodos em funções reutilizáveis.
- Refatoração do código, estruturando o projeto no padrão MVC. 

## :memo: Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.