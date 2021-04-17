const fs = require("fs");
// ------------------------------------
const createDB = () => {
  if (!fs.existsSync("db.json")) {
    fs.writeFileSync("db.json", "[]");
  }
};
// ------------------------------------
const addNewAccount = (data) => {
  //receives object and adds it to db as json with defaults for missing keys
  const defaults = fs.readFileSync("./defaults.json");
  createDB();
  if (findAccount(data.id) === "Account not found") {
    const user = { ...JSON.parse(defaults), ...data };
    const db = JSON.parse(fs.readFileSync("./db.json").toString());
    db.push(user);
    fs.writeFileSync("./db.json", JSON.stringify(db));
    return "New account created";
  } else {
    return "Account ID already exists";
  }
};
// ------------------------------------
const getAllAccounts = () => {
  //finds all accounts and returns json
  createDB();
  const accounts = fs.readFileSync("./db.json").toString();
  if (JSON.parse(accounts).length > 0) {
    return accounts;
  } else return "No accounts found";
};
// ------------------------------------
const findAccount = (id) => {
  //finds account and returns json
  createDB();
  const db = JSON.parse(fs.readFileSync("./db.json").toString());
  const account = db.filter((obj) => obj.id.toString() === id.toString());
  if (account.length > 0) {
    return JSON.stringify(account[0]);
  } else {
    return "Account not found";
  }
};
// ------------------------------------
const accountTransaction = (id, data) => {
  // make deposit, withdrawal and add credit
  const account = findAccount(id);
  if (account !== "Account not found") {
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
  } else {
    return "Account not found";
  }
};
// ------------------------------------
const makeDeposit = (id, data) => {
  //adds cash to account
  const account = JSON.parse(findAccount(id));
  account.cash = account.cash + data.cash;
  updateAccount(id, account);
  return `Deposit of ${data.cash} was performed`;
};
// ------------------------------------
const cashWidthdraw = (id, data) => {
  //take cash from account
  const account = JSON.parse(findAccount(id));
  if (account.cash + account.credit + data.cash >= 0) {
    account.cash = account.cash + data.cash;
    updateAccount(id, account);
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
  updateAccount(id, account);
  return `Credit of ${data.credit} was added`;
};
// ------------------------------------

const updateAccount = (id, data) => {
  const db = JSON.parse(fs.readFileSync("./db.json").toString());
  const accounts = db.filter((obj) => obj.id.toString() !== id.toString());
  accounts.push(data);
  fs.writeFileSync("./db.json", JSON.stringify(accounts));
};
// ------------------------------------
const transfer = (id1, id2, data) => {
  // transfer cash from account id1 to account id2
  let widthdraw = { ...data };
  widthdraw.cash = -1 * widthdraw.cash;
  let account1 = findAccount(id1);
  let account2 = findAccount(id2);
  if (account1 !== "Account not found" && account2 !== "Account not found") {
    account1 = JSON.parse(findAccount(id1));
    account2 = JSON.parse(findAccount(id2));
    if (!account1.active || !account2.active) {
      return "Cannot complete transaction, one or more accounts are disabled";
    } else {
      if (data.cash <= account1.cash + account1.credit) {
        cashWidthdraw(id1, widthdraw);
        makeDeposit(id2, data);
        return "Transaction completed";
      } else
        return `Not enough funds in source account to complete the transaction`;
    }
  } else return "One or both of the accounts do not exist";
};
//------------------------------------
const filterByCash = (cash) => {
  // find all accounts with exact sum of cash
  const account = JSON.parse(getAllAccounts());
  const filtered = account.filter(
    (obj) => obj.cash.toString() === cash.toString()
  );
  if (filtered.length > 0) {
    return JSON.stringify(filtered);
  } else {
    return "No matching accounts found";
  }
};
//------------------------------------
const filterByActiveCash = (cash) => {
  // find all active accounts with exact sum of cash
  const account = JSON.parse(getAllAccounts());
  const filtered = account.filter(
    (obj) => obj.active && obj.cash.toString() === cash.toString()
  );
  if (filtered.length > 0) {
    return JSON.stringify(filtered);
  } else {
    return "No matching accounts found";
  }
};

// ------------------------------------
module.exports = {
  addNewAccount,
  findAccount,
  getAllAccounts,
  accountTransaction,
  transfer,
  filterByCash,
  filterByActiveCash,
};
