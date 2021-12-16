const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

/**
 * cpf ‒ string
 * name ‒ string
 * id ‒ uuid
 * statement ‒ array
 */

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

app.get("/account/:cpf/statement", (req, res) => {
  const { cpf } = req.params;

  const account = customers.find((customer) => customer.cpf == cpf);

  if (!account)
    return res.status(400).send("There is no account under the given CPF");

  return res.json(account.statement);
});

app.listen(3333);
