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

  const id = uuidv4();

  const account = {
    cpf,
    name,
    id,
    statement: [],
  };

  customers.push(account);

  console.log(customers);

  return res.status(201).send();
});

app.listen(3333);
