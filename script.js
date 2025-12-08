let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let currentType = "expense";

const titleInput = document.getElementById("titleInput");
const amountInput = document.getElementById("amountInput");
const categoryInput = document.getElementById("categoryInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("transactionList");

const incomeCard = document.getElementById("incomeCard");
const expenseCard = document.getElementById("expenseCard");
const balanceCard = document.getElementById("balanceCard");

const monthFilter = document.getElementById("monthFilter");

/* FORMAT MONEY */
function formatMoney(num) {
  return "₹" + num.toLocaleString("en-IN");
}

/* TABS */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentType = tab.dataset.type;
  });
});

/* ADD ENTRY */
addBtn.addEventListener("click", addTransaction);
amountInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addTransaction();
});

function addTransaction() {
  const title = titleInput.value.trim();
  const amount = Number(amountInput.value.trim());
  const category = categoryInput.value;

  if (!title || !amount || !category) return;

  transactions.push({
    title,
    amount,
    category,
    type: currentType,
    date: new Date().toISOString().slice(0, 10)
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));
  clearInputs();
  render();
}

function clearInputs() {
  titleInput.value = "";
  amountInput.value = "";
  categoryInput.value = "";
}

/* DELETE */
function deleteTransaction(index) {
  transactions.splice(index, 1);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  render();
}

/* MONTH FILTER */
monthFilter.addEventListener("change", render);

/* RENDER */
function render() {
  list.innerHTML = "";

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let filtered = transactions.filter(t => {
    const d = new Date(t.date);

    if (monthFilter.value === "current") {
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }

    if (monthFilter.value === "previous") {
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    }

    return true;
  });

  let income = 0;
  let expense = 0;

  if (filtered.length === 0) {
    list.innerHTML = "<p style='opacity:0.6;text-align:center;'>No transactions.</p>";
  }

  filtered.forEach((t, index) => {
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

  incomeCard.textContent = `Income: ${formatMoney(income)}`;
  expenseCard.textContent = `Expenses: ${formatMoney(expense)}`;
  balanceCard.textContent = `Balance: ${formatMoney(income - expense)}`;
}

/* INIT */
render();
