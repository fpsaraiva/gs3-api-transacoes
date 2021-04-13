import express from "express";
import User from './user';
import Transaction from './transaction';
import { v4 as uuidGenerator, validate as uuidValidator } from 'uuid';

const app = express();
app.use(express.json());

const listOfUsers = [];

function logRequests(req, res, next) {
  const { method, url } = req;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);
  next();
  console.timeEnd(logLabel);
}

function validateUserId(req, res, next) {
  const { id } = req.params;

  if(!uuidValidator(id)) {
    return res
      .status(400)
      .json({ error: "ID enviado não é um UUID válido."})
  } 
  return next();
}

app.use(logRequests);
app.use("/users/:id", validateUserId)
app.use("/user/:id", validateUserId)

// recurso USERS

app.post("/users", (req, res) => {
  const { name, cpf, email, age } = req.body;

  const createdUser = new User(
    uuidGenerator(),
    name,
    cpf,
    email,
    age
  )

  listOfUsers.push(createdUser)

  return res.json(createdUser);
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  const searchedUser = listOfUsers.findIndex(user => user.id === id);

  if(searchedUser < 0) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  const searchedUserInfo = {
    id,
    name: listOfUsers[searchedUser].name,
    cpf: listOfUsers[searchedUser].cpf,
    email: listOfUsers[searchedUser].email,
    age: listOfUsers[searchedUser].age
  }

  return res.json(searchedUserInfo);
});

app.get("/users", (req, res) => {
  
  if(listOfUsers.length === 0) {
    return res.status(404).json({ error: "Não é possível exibir a lista de usuários, pois ela encontra-se vazia." });
  }

  const usersInfo = listOfUsers.map(user => {
    return {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      age: user.age
    }
  })

  return res.json(usersInfo);
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, cpf, email, age } = req.body;

  const userIndex = listOfUsers.findIndex(user => user.id === id);

  if(userIndex < 0) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  const editedUser = {
    id,
    name,
    cpf,
    email,
    age,
    transactions: listOfUsers[userIndex].transactions
  };

  listOfUsers[userIndex] = editedUser;

  return res.json(editedUser);

});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const userIndex = listOfUsers.findIndex(user => user.id === id);

  if(userIndex < 0) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  listOfUsers.splice(userIndex, 1);

  return res.status(204).json();
});

// recurso TRANSACTIONS

app.post("/user/:id/transactions", (req, res) => {
  let { id } = req.params;
  const { title, value, type } = req.body;

  const userIndex = listOfUsers.findIndex(user => user.id === id);

  if(userIndex < 0) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  const newTransaction = new Transaction(
    title,
    value,
    type
  )

  listOfUsers[userIndex].transactions.push(newTransaction);

  return res.json(listOfUsers[userIndex]);
});

app.get("/user/:userId/transactions/:transactionId", (req, res) => {
  let { userId, transactionId } = req.params;

  transactionId = parseInt(transactionId);

  const userIndex = listOfUsers.findIndex(user => user.id === userId);

  if(userIndex < 0) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  } 
  
  const transactionIndex = listOfUsers[userIndex].transactions.findIndex(transaction => transaction.id === transactionId);

  if(transactionIndex < 0) {
    return res.status(404).json({ error: "Transação não encontrada" });
  } 

  return res.json(listOfUsers[userIndex].transactions[transactionIndex]);
});

app.get("/users/:id/transactions", (req, res) => {
  let { id } = req.params;
  let income = 0;
  let outcome = 0;

  const userIndex = listOfUsers.findIndex(user => user.id === id);

  if(userIndex < 0) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  const listOfTransactions = listOfUsers[userIndex].transactions;

  listOfTransactions.reduce((total, next) => {
    if(next.type === 'income') {
      income += next.value;
    } else if(next.type === 'outcome') {
      outcome -= next.value;
    }
  }, 0);

  const userTransactionsBalance = {
    income: income,
    outcome: outcome,
    total: income - outcome
  }

  return res.json({ transactions: listOfTransactions, balance: userTransactionsBalance });
});

app.put("/users/:userId/transactions/:transactionId", (req, res) => {
  let { userId, transactionId } = req.params;
  const { title, value, type } = req.body;

  transactionId = parseInt(transactionId);

  const userIndex = listOfUsers.findIndex(user => user.id === userId);

  if(userIndex < 0) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  const transactionIndex = listOfUsers[userIndex].transactions.findIndex(transaction => transaction.id === transactionId);

  if(transactionIndex < 0) {
    return res.status(404).json({ error: "Transação não encontrada" });
  } 

  const editedTransaction = {
    id: transactionId,
    title,
    value,
    type
  };

  listOfUsers[userIndex].transactions[transactionIndex] = editedTransaction;

  return res.json(editedTransaction);
});

app.delete("/users/:userId/transactions/:transactionId", (req, res) => {
  let { userId, transactionId } = req.params;

  transactionId = parseInt(transactionId);

  const userIndex = listOfUsers.findIndex(user => user.id === userId);

  if(userIndex < 0) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  } 
  
  const transactionIndex = listOfUsers[userIndex].transactions.findIndex(transaction => transaction.id === transactionId);

  if(transactionIndex < 0) {
    return res.status(404).json({ error: "Transação não encontrada" });
  } 

  listOfUsers[userIndex].transactions.splice(transactionIndex, 1);

  return res.status(204).json();
});

app.listen(3339, () => {
  console.log("Servidor está no ar.");
});
