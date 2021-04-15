const express = require("express");
const chalk = require("chalk");

const app = express();
const {
  addNewAccount,
  findAccount,
  getAllAccounts,
  AccountTransaction,
  transfer,
} = require("./Utils");

app.use(express.json());
// ------------------------------------
app.post("/users", (req, res) => {
  const data = req.body;
  addNewAccount(data);
  res.status(201).send("new user created");
  console.log(chalk.green.inverse("Manager created new user"));
});
// ------------------------------------
app.get("/users/", (req, res) => {
  getAllAccounts();
  console.log("Manager requested account list");
  res.send(getAllAccounts());
});
// ------------------------------------
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  findAccount(id);
  console.log(chalk.green.inverse(`Manager requested account with ID ${id}`));
  res.send(findAccount(id));
});
// ------------------------------------
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;
  AccountTransaction(id, data);
  res.send(AccountTransaction(id, data));
  console.log(
    chalk.green.inverse("Manager made an account transaction attempt")
  );
});
app.put("/users/:id1/:id2", (req, res) => {
  const { id1, id2 } = req.params;
  const data = req.body;
  transfer(id1, id2, data);
  res.send(transfer(id1, id2, data));
  console.log(
    chalk.green.inverse(
      `Manager made a transfer attempt from account ID ${id1} to Account ID ${id2}`
    )
  );
});
// ------------------------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
