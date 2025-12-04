/* ============================
   LOAD DATA
============================ */

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let currentType = "expense";

/* ============================
   GET ELEMENTS
============================ */

const titleInput     = document.getElementById("titleInput");
const amountInput    = document.getElementById("amountInput");
const categoryInput  = document.getElementById("categoryInput");
const addBtn         = document.getElementById("addBtn");

const incomeCard     = document.getElementById("incomeCard");
const expenseCard    = document.getElementById("expenseCard");
const balanceCard    = document.getElementById("balanceCard");

const list           = document.getElementById("transactionList");

/* DEBUG — CONFIRM JS LOADED */
console.log("JS LOADED SUCCESSFULLY");

/* ============================
   FORMAT ₹ MONEY
============================ */

function formatMoney(num) {
  return "₹" + num.toLocaleString("en-IN");
}

/* ============================
   TAB SWITCH (INCOME/EXPENSE)
============================ */

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentType = tab.dataset.type;
  });
});

/* ============================
   ADD TRANSACTION
============================ */

addBtn.addEventListener("click", addTransaction);

amountInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTransaction();
});

function addTransaction() {
  const title = titleInput.value.trim();
  const amount = Number(amountInput.value.trim());
  const category = categoryInput.value;

  if (!title || !amount || !category) return;

  const entry = {
    title,
    amount,
    category,
    type: currentType,
    date: new Date().toISOString().slice(0, 10)
  };

  transactions.push(entry);

  save();
  render();
  clearInputs();
}

function clearInputs() {
  titleInput.value = "";
  amountInput.value = "";
  categoryInput.value = "";
}

/* ============================
   DELETE TRANSACTION
============================ */

function deleteTransaction(index) {
  transactions.splice(index, 1);
  save();
  render();
}

/* ============================
   SAVE
============================ */

function save() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

/* ============================
   RENDER LIST + SUMMARY
============================ */

function render() {
  list.innerHTML = "";

  if (transactions.length === 0) {
    list.innerHTML = "<p style='opacity:0.6;text-align:center;'>No transactions yet.</p>";
    updateSummary(0, 0);
    return;
  }

  let income = 0;
  let expense = 0;

  transactions.forEach((t, index) => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;

    const li = document.createElement("li");
    li.className = "transaction";

    li.innerHTML = `
      <div>
        <strong>${t.title}</strong> — ${formatMoney(t.amount)}<br>
        <small>${t.category} · ${t.date}</small>
      </div>

      <div class="delete" onclick="deleteTransaction(${index})">✕</div>
    `;

    list.appendChild(li);
  });

  updateSummary(income, expense);
}

/* ============================
   SUMMARY CARDS
============================ */

function updateSummary(income, expense) {
  incomeCard.textContent  = `Income: ${formatMoney(income)}`;
  expenseCard.textContent = `Expenses: ${formatMoney(expense)}`;
  balanceCard.textContent = `Balance: ${formatMoney(income - expense)}`;
}

/* ============================
   THEME TOGGLE
============================ */

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("oled");
});

/* ============================
   INITIAL RENDER
============================ */

render();
