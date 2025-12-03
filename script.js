/* ============================
   Finance Dashboard - script.js
   Compatible with the updated HTML/CSS
============================= */

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let currentType = "expense";

/* --- DOM --- */
const titleInput = document.getElementById("titleInput");
const amountInput = document.getElementById("amountInput");
const categorySelect = document.getElementById("categorySelect");
const submitBtn = document.getElementById("submitBtn");

const addExpenseBtn = document.getElementById("addExpenseBtn");
const addIncomeBtn = document.getElementById("addIncomeBtn");

const list = document.getElementById("transactionList");

const incomeSpan = document.getElementById("income");
const expensesSpan = document.getElementById("expenses");
const balanceSpan = document.getElementById("balance");

const themeToggle = document.getElementById("themeToggle");

/* ============================
   UTILITIES
============================= */

function save() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function clearInputs() {
  titleInput.value = "";
  amountInput.value = "";
  categorySelect.selectedIndex = 0;
}

/* ============================
   RENDER
============================= */

function render() {
  list.innerHTML = "";

  let income = 0;
  let expense = 0;

  transactions.forEach((t, index) => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;

    const li = document.createElement("li");
    li.className = "transaction-item";
    li.innerHTML = `
      <div>
        <strong>${escapeHtml(t.title)}</strong> — ₹${t.amount.toLocaleString()}<br>
        <small style="opacity:.8">${escapeHtml(t.category)} · ${t.date}</small>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <div style="font-size:14px;opacity:.85">${t.type === 'income' ? 'Income' : 'Expense'}</div>
        <div class="delete" style="cursor:pointer;opacity:.8" data-index="${index}">✕</div>
      </div>
    `;

    list.appendChild(li);
  });

  incomeSpan.textContent = income.toLocaleString();
  expensesSpan.textContent = expense.toLocaleString();
  balanceSpan.textContent = (income - expense).toLocaleString();
}

/* simple HTML escape for user input */
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
}

/* ============================
   ADD TRANSACTION
============================= */

submitBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categorySelect.value;

  if (!title || !amount || !category) {
    // lightweight validation — you can replace with a nicer UI later
    return;
  }

  const today = new Date();
  const isoDate = today.toISOString().slice(0, 10);

  transactions.push({
    title,
    amount,
    category,
    type: currentType,
    date: isoDate
  });

  save();
  render();
  clearInputs();
});

/* allow Enter on amount to add quickly */
amountInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitBtn.click();
});

/* ============================
   TOGGLE TYPE (expense / income)
============================= */

function setType(type) {
  currentType = type;
  addExpenseBtn.classList.toggle("active", type === "expense");
  addIncomeBtn.classList.toggle("active", type === "income");
  // change submit button text for clarity
  submitBtn.textContent = type === "income" ? "Add Income" : "Add Entry";
}

addExpenseBtn.addEventListener("click", () => setType("expense"));
addIncomeBtn.addEventListener("click", () => setType("income"));

/* ============================
   DELETE (event delegation)
============================= */

list.addEventListener("click", (e) => {
  const del = e.target.closest(".delete");
  if (!del) return;
  const idx = Number(del.getAttribute("data-index"));
  if (Number.isInteger(idx)) {
    transactions.splice(idx, 1);
    save();
    render();
  }
});

/* ============================
   THEME (OLED-like)
============================= */

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("oled");
});

/* ============================
   INITIAL
============================= */

setType("expense"); // default
render();
