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
// ----------------- Create new account -----------------------------------
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
// ----------------- List all accounts -------------------------------------
app.get("/accounts/", (req, res) => {
  console.log(chalk.green.inverse("Manager requested account list"));
  res.send(getAllAccounts());
});
// ----------------- Find account by ID ------------------------------------
app.get("/accounts/:id", (req, res) => {
  const { id } = req.params;
  console.log(chalk.green.inverse(`Manager requested account with ID ${id}`));
  res.send(findAccount(id));
});
// ----------------- Filter accounts by cash amount ------------------------
app.get("/cash/:cash", (req, res) => {
  const { cash } = req.params;
  console.log(
    chalk.green.inverse(`Manager requested accounts with ${cash} of cash`)
  );
  res.send(filterByCash(cash));
});
// ----------------- Filter active accounts by cash amount -----------------
app.get("/activecash/:cash", (req, res) => {
  const { cash } = req.params;
  console.log(
    chalk.green.inverse(
      `Manager requested active accounts with ${cash} of cash`
    )
  );
  res.send(filterByActiveCash(cash));
});
// ----------------- Desposit, withdraw cash and add credit -----------------
app.put("/accounts/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;
  res.send(accountTransaction(id, data));
  console.log(
    chalk.green.inverse("Manager made an account transaction attempt")
  );
});
// ------------------ Transfer money from Account1 to Account2 ---------------
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
// ------------------ Handle errors unhandled by defensive code ---------------
app.use((req, res, next) => {
  const error = new Error("Page not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send(error.message);
});
// ------------------ Start server on selected port number ---------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
