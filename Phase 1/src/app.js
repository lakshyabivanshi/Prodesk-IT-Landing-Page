const form = document.getElementById('cashFlowform');
const errorMsg = document.getElementById('error-msg');
const totalSalary = document.getElementById('totalSalary');
const expensesNameInput = document.getElementById('expensesName');
const expensesAmountInput = document.getElementById('expensesAmount');

const displaySalary = document.getElementById('displaySalary');
const displayExpenses = document.getElementById('displayExpenses');
const displayBalance = document.getElementById('displayBalance');
const expenseList = document.getElementById('expenseList');

let allExpenses = [];

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const salary = parseFloat(totalSalary.value);
    const expName = expensesNameInput.value.trim();
    const expAmount = parseFloat(expensesAmountInput.value);

    //Error Checking
    if (isNaN(salary) || salary <= 0 || expName === "" || isNaN(expAmount) || expAmount <= 0) {
        errorMsg.classList.remove('hidden');
        return;
    }

    errorMsg.classList.add("hidden");

    allExpenses.push({ name: expName, amount: expAmount });

    let totalExpenses = 0;
    for (let i = 0; i < allExpenses.length; i++) {
        totalExpenses = totalExpenses + allExpenses[i].amount;
    }

    let remainingBalance = salary - totalExpenses;
    if(remainingBalance<=0){
        remainingBalance = 0;
        errorMsg.innerHTML = "Warning : Your expenses have reach your salary limit!";
        errorMsg.classList.remove("hidden");
        
    }

    displaySalary.innerText = "₹" + salary;
    displayExpenses.innerText = "₹" + totalExpenses;
    displayBalance.innerText = "₹" + remainingBalance;

    const newListItem = document.createElement('li');
    newListItem.className = "flex justify-between bg-zinc-900 border border-zinc-800 p-3 rounded-xl mt-2";
    newListItem.innerHTML = `<span>${expName}</span> <span class="text-purple-400 font-bold">₹${expAmount}</span>`;
    expenseList.appendChild(newListItem);

    expensesNameInput.value = "";
    expensesAmountInput.value = "";
});

