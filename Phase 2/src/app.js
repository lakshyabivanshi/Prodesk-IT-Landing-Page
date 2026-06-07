const form = document.getElementById('cashFlowform');
const errorMsg = document.getElementById('error-msg');
const totalSalary = document.getElementById('totalSalary');
const expensesNameInput = document.getElementById('expensesName');
const expensesAmountInput = document.getElementById('expensesAmount');

const displaySalary = document.getElementById('displaySalary');
const displayExpenses = document.getElementById('displayExpenses');
const displayBalance = document.getElementById('displayBalance');
const expenseList = document.getElementById('expenseList');
const resetBtn = document.getElementById('resetBtn');


//Taking previous data from local storage otherwise start from empty
let allExpenses = JSON.parse(localStorage.getItem('savedExpenses')) || [];
let salary = parseFloat(localStorage.getItem('savedSalary')) || 0;

let myChart = null;

//Print previous data on screen
window.addEventListener('DOMContentLoaded', () => {
    errorMsg.classList.add("hidden");
    initChart();
    updateUi();
});

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const salaryVal = parseFloat(totalSalary.value);
    const expName = expensesNameInput.value.trim();
    const expAmount = parseFloat(expensesAmountInput.value);

    //Error Checking
    if (isNaN(salaryVal) || salaryVal <= 0 || expName === "" || isNaN(expAmount) || expAmount <= 0) {
        errorMsg.querySelector('p').innerHTML = "Error! Please fill all the fields completely <br> Empty or Negative values are not allowed"
        errorMsg.classList.remove('hidden');
        return;
    }

    errorMsg.classList.add("hidden");

    salary = salaryVal;

    allExpenses.push({ id: Date.now().toString(), name: expName, amount: expAmount })

    localStorage.setItem('savedSalary', salary);
    localStorage.setItem('savedExpenses', JSON.stringify(allExpenses));

    updateUi();

    let totalExpenses = allExpenses.reduce((sum, item) => sum + item.amount, 0);

    if (salary - totalExpenses <= 0) {
        errorMsg.querySelector('p').innerHTML = "Budget Notification: Your Total Salary Limit Has Been Reached!";
        errorMsg.classList.remove("hidden");
    }

    let remainingBalance = salary - totalExpenses;
    if (remainingBalance <= 0) {
        remainingBalance = 0
        errorMsg.querySelector('p').innerHTML = "Budget Notrification: Your total salary limit has been reached!"
        errorMsg.classList.remove('hidden');
    }

    displaySalary.innerText = "₹" + salary;
    displayExpenses.innerText = "₹" + totalExpenses;
    displayBalance.innerText = "₹" + remainingBalance;

    renderList();
    updateChart(remainingBalance, totalExpenses);

    expensesNameInput.value = "";
    expensesAmountInput.value = "";
});

function renderList() {
    expenseList.innerHTML = "";
    allExpenses.forEach(expense => {
        const newListItem = document.createElement('li');
        newListItem.className = "flex justify-between bg-zinc-900 border border-zinc-800 p-3 rounded-xl mt-2 w-full";

        newListItem.innerHTML = `
    <span>${expense.name}</span>
    <div class = "flex items-center gap-3">
        <span class="text-purple-400 font-bold">₹${expense.amount}</span>
        <button onclick="deleteExpense('${expense.id}')" class= "text-red-500 hover:text-red-400 cursor-pointer"><i class="fa-solid fa-trash" style="color: rgb(255, 255, 255)"></i></button>
        </div>`;
        expenseList.appendChild(newListItem);

    });
}

function deleteExpense(idTodelete) {
    allExpenses = allExpenses.filter(item => item.id !== idTodelete);
    localStorage.setItem('savedExpenses', JSON.stringify(allExpenses));

    let totalExpenses = 0;
    for (let i = 0; i < allExpenses.length; i++) {
        totalExpenses += allExpenses[i].amount;
    }
    let remainingBalance = salary - totalExpenses;
    if (remainingBalance < 0) remainingBalance = 0;

    displayExpenses.innerText = "₹" + totalExpenses;
    displayBalance.innerText = "₹" + remainingBalance;

    renderList();
    updateChart(remainingBalance, totalExpenses);
}

function updateUi() {
    let totalExpenses = allExpenses.reduce((sum, item) => sum + item.amount, 0);
    let remainingBalance = salary - totalExpenses;

    if (remainingBalance < 0) remainingBalance = 0;

    displaySalary.innerText = "₹" + salary;
    displayExpenses.innerText = "₹" + totalExpenses;
    displayBalance.innerText = "₹" + remainingBalance;

    totalSalary.value = salary > 0 ? salary : "";
    renderList();
    updateChart(remainingBalance, totalExpenses);
}

resetBtn.addEventListener('click', (event) => {
    event.preventDefault();

    salary = 0;
    allExpenses = [];

    localStorage.removeItem('savedSalary');
    localStorage.removeItem('savedExpenses');

    form.reset();
    errorMsg.classList.add("hidden");

    displaySalary.innerText = "₹0";
    displayExpenses.innerText = "₹0";
    displayBalance.innerText = "₹0";
    expenseList.innerHTML = "";
    updateChart(0, 0);
});

//Chart Function
function initChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Remaining Balance', 'Total Expenses'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#22c55e', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#a1a1aa' }
                }
            }
        }

    });
}

function updateChart(balance, expenses) {
    if (myChart) {
        myChart.data.datasets[0].data = [balance, expenses];
        myChart.update();
    }
}