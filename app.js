const express = require("express");
const chalk = require("chalk");

const app = express();
const {
  addNewAccount,
  findAccount,
  getAllAccounts,
  accountTransaction,
  transfer,
  filterByCash,
  filterByActiveCash,
} = require("./Utils");

app.use(express.json());
// ------------------------------------
app.post("/accounts", (req, res) => {
  try {
    const data = req.body;
    res.status(201).send(addNewAccount(data));
    console.log(
      chalk.green.inverse("Manager attempted to create a new account")
    );
  } catch (e) {
    console.log(chalk.red.inverse(e.message));
    res.status(400).send({ error: e.message });
  }
});
// ------------------------------------
app.get("/accounts/", (req, res) => {
  console.log("Manager requested account list");
  res.send(getAllAccounts());
});
// ------------------------------------
app.get("/accounts/:id", (req, res) => {
  const { id } = req.params;
  console.log(chalk.green.inverse(`Manager requested account with ID ${id}`));
  res.send(findAccount(id));
});
app.get("/cash/:cash", (req, res) => {
  const { cash } = req.params;
  console.log(
    chalk.green.inverse(`Manager requested accounts with ${cash} of cash`)
  );
  res.send(filterByCash(cash));
});
app.get("/activecash/:cash", (req, res) => {
  const { cash } = req.params;
  console.log(
    chalk.green.inverse(
      `Manager requested active accounts with ${cash} of cash`
    )
  );
  res.send(filterByActiveCash(cash));
});
// ------------------------------------
app.put("/accounts/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;
  res.send(accountTransaction(id, data));
  console.log(
    chalk.green.inverse("Manager made an account transaction attempt")
  );
});
app.put("/accounts/:id1/:id2", (req, res) => {
  const { id1, id2 } = req.params;
  const data = req.body;
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
