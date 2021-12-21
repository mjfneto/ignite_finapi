const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());
// app.use(verifyExistingAccountByCPF);

const customers = [];

app.post("/account", (req, res) => {
  const { cpf, name } = req.body;

  const existingCpf = customers.some((customer) => customer.cpf == cpf);

  if (existingCpf)
    return res.status(400).json({
      error: "An account under that CPF exists",
    });

  const account = {
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  };

  customers.push(account);

  return res.status(201).json(account);
});

app.post("/account/transaction", verifyExistingAccountByCPF, (req, res) => {
  const { type, value, ...transaction } = req.body;
  const { statement } = req.account;

  const balance = getBalance(statement);

  if (type == "debit") {
    if (balance < value || statement.length == 0)
      return res.status(403).json({
        error: "Insufficient funds",
      });
  }

  statement.push({
    ...transaction,
    value,
    createdAt: new Date(),
    type,
  });

  res.status(201).send();
});

app.get("/account", verifyExistingAccountByCPF, (req, res) => {
  const { account } = req;

  return res.json(account);
});

app.get("/account/statement", verifyExistingAccountByCPF, (req, res) => {
  const { statement } = req.account;

  return res.json(statement);
});

app.get("/account/statement/date", verifyExistingAccountByCPF, (req, res) => {
  const query = req.query;
  const { statement } = req.account;

  const results = queryByDate(statement, query);

  return res.json(results);
});

app.put("/account/update/", verifyExistingAccountByCPF, (req, res) => {
  const { name } = req.body;
  const { account } = req;

  account.name = name;

  return res.status(201).send();
});

app.listen(3333);

// Middlewares

function verifyExistingAccountByCPF(req, res, next) {
  const { cpf } = req.headers;

  const account = customers.find((customer) => customer.cpf == cpf);

  if (!account)
    return res.status(400).send("There is no account under the given CPF");

  req.account = account;

  next();
}

// Utils

function getBalance(statement) {
  return statement.reduce((total, { type, value }) => {
    return type == "debit" ? total - value : total + value;
  }, 0);
}

function queryByDate(statement, query) {
  return statement.filter(({ createdAt }) => {
    const day = createdAt.getDate();
    const month = createdAt.getMonth() + 1;
    const year = createdAt.getFullYear();

    return (
      day == Number(query.day) &&
      month == Number(query.month) &&
      year == Number(query.year)
    );
  });
}
