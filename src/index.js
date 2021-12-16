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

  return res.status(201).send();
});

app.listen(3333);
