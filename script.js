// ============================
// Personal Finance Tracker App
// ============================

// Load transactions from localStorage OR use empty array
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

//DOM ELEMENTS
const form = document.getElementById("transaction-form");
const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const list = document.getElementById("transaction-list");
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");

//EVENT: Form Submit
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    desc: descInput.value,
    amount: +amountInput.value,
    category: categoryInput.value,
    date: dateInput.value
  };

  transactions.push(transaction);

  saveToLocalStorage(); //Save after adding
  renderTransactions(); //Re-render UI
  form.reset();
});

// FUNCTION: Render All Transactions 
function renderTransactions() {
  list.innerHTML = ""; // Clear list first
  transactions.forEach(addTransactionDOM);
  updateBalance();
}

// FUNCTION: Add single transaction to DOM
function addTransactionDOM(transaction) {
  const li = document.createElement("li");
  const sign = transaction.amount > 0 ? "+" : "-";

  li.innerHTML = `
    ${transaction.desc} (${transaction.category}) - ${sign}${Math.abs(transaction.amount)} ₹ 
    <button onclick="deleteTransaction(${transaction.id})">❌</button>
  `;

  list.appendChild(li);
}

//  FUNCTION: Update Balance
function updateBalance() {
  const amounts = transactions.map(t => t.amount);

  const total = amounts.length > 0 
    ? amounts.reduce((acc, val) => acc + val, 0).toFixed(2) 
    : 0;

  const income = amounts.length > 0 
    ? amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0).toFixed(2) 
    : 0;

  const expense = amounts.length > 0 
    ? (amounts.filter(a => a < 0).reduce((acc, val) => acc + val, 0) * -1).toFixed(2) 
    : 0;

  balanceEl.innerText = total;
  incomeEl.innerText = income;
  expenseEl.innerText = expense;
}

//  FUNCTION: Delete Transaction 
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveToLocalStorage(); // ✅ Save after deleting
  renderTransactions();
}

// FUNCTION: Save to Local Storage 
function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

//INIT: Load saved transactions when page opens
renderTransactions();
