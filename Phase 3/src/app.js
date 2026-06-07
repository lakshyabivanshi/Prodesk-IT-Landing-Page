const form = document.getElementById('cashFlowform');
const errorMsg = document.getElementById('error-msg');
const totalSalary = document.getElementById('totalSalary');
const expensesNameInput = document.getElementById('expensesName');
const expensesAmountInput = document.getElementById('expensesAmount');

const displaySalary = document.getElementById('displaySalary');
const displayExpenses = document.getElementById('displayExpenses');
const displayBalance = document.getElementById('displayBalance');
const balanceContainer = document.getElementById('balanceContainer');
const expenseList = document.getElementById('expenseList');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');
const currencySelector = document.getElementById('currencySelector');
const url = "https://api.frankfurter.dev/v1/latest?base=INR";


//Taking previous data from local storage otherwise start from empty
let allExpenses = JSON.parse(localStorage.getItem('savedExpenses')) || [];
let salary = parseFloat(localStorage.getItem('savedSalary')) || 0;
let currentCurrency = localStorage.getItem('savedCurrency') || "INR";
let exchangeRates = {};

let myChart = null;

//Print previous data on screen
window.addEventListener('DOMContentLoaded', async() => {
    errorMsg.classList.add("hidden");
    initChart();
    
    try{
    const response = await fetch(url);
    const data = await response.json();
    exchangeRates = data.rates;
    exchangeRates["INR"] = 1;

    //dropdown options dynamically load
    currencySelector.innerHTML = "";
    Object.keys(exchangeRates).forEach(curr => {
        const option = document.createElement('option');
        option.value = curr;
        option.className = "bg-zinc-950 text-zinc-100";
        option.innerText = curr;
        if(curr===currentCurrency) option.selected = true;
        currencySelector.appendChild(option);
    });
}catch (error){
    console.error("API fetch error: ", error);
    currencySelector.innerHTML = '<option value="INR" class="bg-zinc-950 text-zinc-100">INR</option>';
    exchangeRates["INR"] = 1;
}
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
    const rate = exchangeRates[currentCurrency] || 1;
    salary = salaryVal/rate;
    allExpenses.push({ id: Date.now().toString(), name: expName, amount: expAmount/rate});

    localStorage.setItem('savedSalary', salary);
    localStorage.setItem('savedExpenses', JSON.stringify(allExpenses));
    updateUi();

    let totalExpenses = allExpenses.reduce((sum, item) => sum + (item.amount * rate), 0);
    let currentSalary = salary*rate;

    if (salary - totalExpenses <= 0){
        errorMsg.querySelector('p').innerHTML = "Budget Notification: Your Total Salary Limit Has Been Reached!";
        errorMsg.classList.remove("hidden");
    }

    let remainingBalance = currentSalary - totalExpenses;
    if (remainingBalance <= 0) {
        remainingBalance = 0
        errorMsg.querySelector('p').innerHTML = "Budget Notrification: Your total salary limit has been reached!"
        errorMsg.classList.remove('hidden');
    }

    displaySalary.innerText = currentCurrency + " " + currentSalary.toFixed(2);
    displayExpenses.innerText = currentCurrency + " " + totalExpenses.toFixed(2);
    displayBalance.innerText = currentCurrency+ " " + remainingBalance.toFixed(2);

    renderList();
    updateChart(remainingBalance, totalExpenses);

    expensesNameInput.value = "";
    expensesAmountInput.value = "";
});

function renderList() {
    expenseList.innerHTML = "";

    const rate = exchangeRates[currentCurrency] || 1;

    allExpenses.forEach(expense => {
        const convertedAmount = (expense.amount * rate).toFixed(2);
        const newListItem = document.createElement('li');
        newListItem.className = "flex justify-between bg-zinc-900 border border-zinc-800 p-3 rounded-xl mt-2 w-full";

        newListItem.innerHTML = `
    <span>${expense.name}</span>
    <div class = "flex items-center gap-3">
        <span class="text-purple-400 font-bold">${currentCurrency} ${convertedAmount}</span>
        <button onclick="deleteExpense('${expense.id}')" class= "text-red-500 hover:text-red-400 cursor-pointer"><i class="fa-solid fa-trash" style="color: rgb(255, 255, 255)"></i></button>
        </div>`;
        expenseList.appendChild(newListItem);
    });
}

window.deleteExpense = function (idTodelete) {
    allExpenses = allExpenses.filter(item => item.id !== idTodelete);
    localStorage.setItem('savedExpenses', JSON.stringify(allExpenses));

    const rate = exchangeRates[currentCurrency] || 1;

    let totalExpenses = 0;
    for (let i = 0; i < allExpenses.length; i++) {
        totalExpenses += allExpenses[i].amount*rate;
    }
    let currentSalary = salary*rate;
    let remainingBalance = currentSalary - totalExpenses;
    if (remainingBalance < 0) remainingBalance = 0;

    displayExpenses.innerText = currentCurrency+ " " + totalExpenses.toFixed(2);
    displayBalance.innerText = currentCurrency+ " " + remainingBalance.toFixed(2);

    renderList();
    updateChart(remainingBalance, totalExpenses);
}

function updateUi() {
    const rate = exchangeRates[currentCurrency] || 1;
    let totalExpenses = allExpenses.reduce((sum, item) => sum + (item.amount*rate), 0);

    let currentSalary = salary*rate
    let remainingBalance = currentSalary - totalExpenses;

    if (remainingBalance < 0) remainingBalance = 0;

    displaySalary.innerText = currentCurrency + " " + currentSalary.toFixed(2);
    displayExpenses.innerText = currentCurrency + " " + totalExpenses.toFixed(2);
    displayBalance.innerText = currentCurrency + " " + remainingBalance.toFixed(2);

    totalSalary.value = salary > 0 ? currentSalary.toFixed(2) : "";
    renderList();
    updateChart(remainingBalance, totalExpenses);
    checkLowBalance(remainingBalance, currentSalary);
}

currencySelector.addEventListener('change', (e)=>{
    currentCurrency = e.target.value;
    localStorage.setItem('savedCurrency', currentCurrency);
    updateUi();

});

resetBtn.addEventListener('click', (event) => {
    event.preventDefault();

    salary = 0;
    allExpenses = [];
    currentCurrency = "INR";

    localStorage.removeItem('savedSalary');
    localStorage.removeItem('savedExpenses');
    localStorage.removeItem('savedCurrency');

    form.reset();
    currencySelector.value = "INR";
    errorMsg.classList.add("hidden");

    displaySalary.innerText = "INR 0";
    displayExpenses.innerText = "INR 0";
    displayBalance.innerText = "INR 0";
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

downloadBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const rate = exchangeRates[currentCurrency] || 1;

    let currentSalary = (salary*rate).toFixed(2);
    let totalExpenses = allExpenses.reduce((sum, item)=> sum + (item.amount*rate), 0).toFixed(2);

    let remainingBalance = (currentSalary-totalExpenses);
    if(remainingBalance<0){
        remainingBalance = 0;
    }
    else{
        remainingBalance = remainingBalance.toFixed(2);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(147, 51, 234);
    doc.text("Cash Flow Statement", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 26);

    //summary print
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Salary: ${currentCurrency} ${currentSalary}`, 14, 40);
    doc.text(`Total Expenses is ${currentCurrency} ${totalExpenses}`, 14, 47);
    doc.text(`Remaining Balance: ${currentCurrency} ${remainingBalance}`, 14, 54);

    const tableRows = [];
    allExpenses.forEach((expense, index) => { 
        tableRows.push([index + 1, expense.name, `${currentCurrency} ${(expense.amount*rate).toFixed(2)}`]);
    });

    doc.autoTable({
        startY: 65,
        head: [['Section No.', 'Expense Name', 'Amount']],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [147, 51, 234] }
    });

    doc.save("Cashflow_Report.pdf");
});

function checkLowBalance(remainingBalance, currentSalary){
    if(currentSalary<=0){
        errorMsg.classList.add('hidden');

        balanceContainer.classList.remove('text-red-500', 'bg-red-950/20', 'p-2', 'rounded-xl', 'border', 'border-red-500/30')
        balanceContainer.classList.add('text-green-500');
        return;
    }

    const threshold = currentSalary*0.10;
    if(remainingBalance<=threshold){
        errorMsg.querySelector('p').innerHTML = `
        <i class="fa-solid fa-triangle-exclamation mr-1"></i>
        <strong>Balance Warning: </strong> Your remaining budget has dropped below 10% of your total salary! Please review your spending!`;
        errorMsg.classList.remove('hidden');

        balanceContainer.classList.remove('text-green-500');
        balanceContainer.classList.add('text-red-500', 'bg-red-950/20', 'p-2', 'rounded-xl', 'border', 'border-red-500/30');
    }
    else{
        errorMsg.classList.add('hidden');
        balanceContainer.classList.remove('text-red-500', 'bg-red-950/20', 'p-2', 'rounded-xl', 'border', 'border-red-500/30')
        balanceContainer.classList.add('text-green-500');
       
    }
}