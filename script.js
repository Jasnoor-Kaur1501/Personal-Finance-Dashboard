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

/* TAB SWITCH */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentType = tab.dataset.type;
  });
});

/* ADD TRANSACTION */
addBtn.addEventListener("click", () => {
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

  save();
  render();
  clearInputs();
});

function clearInputs() {
  titleInput.value = "";
  amountInput.value = "";
  categoryInput.value = "";
}

function save() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

/* DELETE */
function deleteTransaction(index) {
  transactions.splice(index, 1);
  save();
  render();
}

/* RENDER */
function render() {
  list.innerHTML = "";

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

  incomeCard.textContent = `Income: ₹${income}`;
  expenseCard.textContent = `Expenses: ₹${expense}`;
  balanceCard.textContent = `Balance: ₹${income - expense}`;
}

/* THEME TOGGLE */
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("oled");
});

render();
