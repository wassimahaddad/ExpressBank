const fs = require("fs");
const defaults = fs.readFileSync("./defaults.json");
// ------------------------------------
const addNewAccount = (data) => {
  //receives object and adds it to db as json with defaults for missing keys
  const user = { ...JSON.parse(defaults), ...data };
  const db = JSON.parse(fs.readFileSync("./db.json").toString());
  db.push(user);
  fs.writeFileSync("./db.json", JSON.stringify(db));
};
// ------------------------------------
const getAllAccounts = () => {
  return fs.readFileSync("./db.json");
};
// ------------------------------------
const findAccount = (id) => {
  //finds user and returns json
  const db = JSON.parse(fs.readFileSync("./db.json").toString());
  const user = db.filter((obj) => obj.id === id);
  return JSON.stringify(user[0]);
};
// ------------------------------------
const AccountTransaction = (id, data) => {
  const active = JSON.parse(findAccount(id)).active;
  if (active) {
    let m1 = "",
      m2 = "";
    if (data.cash) {
      if (data.cash > 0) {
        m1 = makeDeposit(id, data);
      } else {
        m1 = cashWidthdraw(id, data);
      }
    }
    if (data.credit) {
      if (data.credit > 0) {
        m2 = addCredit(id, data);
      } else {
        m2 = "Invalid credit added";
      }
    }
    return m1 + "\n" + m2;
  } else return "Cannot complete transaction, account is not active";
};
// ------------------------------------
const makeDeposit = (id, data) => {
  //adds cash to account
  const account = JSON.parse(findAccount(id));
  account.cash = account.cash + data.cash;
  removeUser(id);
  addAccount(account);
  return `Deposit of ${data.cash} was performed`;
};
// ------------------------------------
const cashWidthdraw = (id, data) => {
  //take cash to account
  const account = JSON.parse(findAccount(id));
  if (account.cash + account.credit + data.cash >= 0) {
    account.cash = account.cash + data.cash;
    console.log(data.cash);
    removeUser(id);
    addAccount(account);
    return `Withdrawal of ${Math.abs(data.cash)} was performed`;
  } else if (typeof data.cash !== "number") {
    return "Ivalid cash input";
  } else return "Not enough funds to complete the withdrawal";
};
// ------------------------------------
const addCredit = (id, data) => {
  //adds credit to account
  const account = JSON.parse(findAccount(id));
  account.credit = account.credit + data.credit;
  removeUser(id);
  addAccount(account);
  return `Credit of ${data.credit} was added`;
};
// ------------------------------------
const addAccount = (data) => {
  //receives object and adds it to db as json
  const db = JSON.parse(fs.readFileSync("./db.json").toString());
  db.push(data);
  fs.writeFileSync("./db.json", JSON.stringify(db));
};
// ------------------------------------
const removeUser = (id) => {
  const db = JSON.parse(fs.readFileSync("./db.json").toString());
  const users = db.filter((obj) => obj.id !== id);
  fs.writeFileSync("./db.json", JSON.stringify(users));
};
// ------------------------------------
const transfer = (id1, id2, data) => {
  let widthdraw = { ...data };
  widthdraw.cash = -1 * widthdraw.cash;
  const account1 = JSON.parse(findAccount(id1));
  const funds = account1.cash + account1.credit;
  if (data.cash <= funds) {
    cashWidthdraw(id1, widthdraw);
    makeDeposit(id2, data);
    return "Transaction completed";
  } else
    return `Not enough funds in source account to complete the transaction`;
};
// ------------------------------------
module.exports = {
  addAccount,
  addNewAccount,
  findAccount,
  makeDeposit,
  getAllAccounts,
  addCredit,
  AccountTransaction,
  transfer,
};