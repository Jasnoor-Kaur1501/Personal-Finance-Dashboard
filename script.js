let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let currentType = "expense";

const titleInput    = document.getElementById("titleInput");
const amountInput   = document.getElementById("amountInput");
const categoryInput = document.getElementById("categoryInput");
const addBtn        = document.getElementById("addBtn");

const incomeCard    = document.getElementById("incomeCard");
const expenseCard   = document.getElementById("expenseCard");
const balanceCard   = document.getElementById("balanceCard");

const list          = document.getElementById("transactionList");

/* Tabs */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentType = tab.dataset.type;
  });
});

/* Add Entry */
addBtn.addEventListener("click", addTransaction);
amountInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTransaction();
});

function addTransaction() {
  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categoryInput.value;

  if (!title || !amount || !category) return;

  transactions.push({
    title,
    amount,
    category,
    type: currentType,
    date: new Date().toISOString().slice(0, 10)
  });

  save();
  render();
  clearInputs();
}

function clearInputs() {
  titleInput.value = "";
  amountInput.value = "";
  categoryInput.value = "";
}

/* Save */
function save() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

/* Delete */
function deleteTransaction(index) {
  transactions.splice(index, 1);
  save();
  render();
}

/* Render */
function render() {
  list.innerHTML = "";

  if (transactions.length === 0) {
    list.innerHTML = "<p style='opacity:0.6;text-align:center;'>No transactions yet</p>";
    updateSummary(0, 0);
    return;
  }

  let income = 0, expense = 0;

  transactions.forEach((t, index) => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;

    const li = document.createElement("li");
    li.className = "transaction";

    li.innerHTML = `
      <div>
        <strong>${t.title}</strong> — ₹${t.amount}<br>
        <small>${t.category} · ${t.date}</small>
      </div>
      <div class="delete" onclick="deleteTransaction(${index})">✕</div>
    `;

    list.appendChild(li);
  });

  updateSummary(income, expense);
}

function updateSummary(income, expense) {
  incomeCard.textContent  = `Income: ₹${income}`;
  expenseCard.textContent = `Expenses: ₹${expense}`;
  balanceCard.textContent = `Balance: ₹${income - expense}`;
}

/* Init */
render();
