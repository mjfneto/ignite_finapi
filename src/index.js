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

app.get("/account/statement", verifyExistingAccountByCPF, (req, res) => {
  const { statement } = req.account;

  return res.json(statement);
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
