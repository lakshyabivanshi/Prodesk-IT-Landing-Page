import { useState, useEffect, Fragment } from "react";

function ExpenseTracker() {
    const [expenses, setExpenses] = useState([]);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    //Load Data
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('expenses')) || [];
        setExpenses(saved);
    }, []);

    //Add Logic
    const handleAdd = () => {
        if (!name.trim() || !amount || !amount.trim()) {
            setError(true);
            return;
        }
        setError(false);
        setLoading(true);


        const newExpense = { id: Date.now(), name: name.trim(), amount: Number(amount) };

        const updated = [...expenses, newExpense];
        setExpenses(updated);
        localStorage.setItem('expenses', JSON.stringify(updated));
        console.log("[Analytics] User interacted with React Expense Tracker");
        setLoading(false);
        setName('');
        setAmount('');
    };

    const handleDelete = (id) => {
        const updateExpenses = expenses.filter((ex) => ex.id !== id);
        setExpenses(updateExpenses);
        localStorage.setItem('expenses', JSON.stringify(updateExpenses));
    };

    return (
        <div className="p-8 max-w-2xl mx-auto border border-gray-300 mt-5">
            <h1 className="text-2xl text-center font-bold mb-6 uppercase">Expense Tracker</h1>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex flex-col flex-grow w-full">
                    <input type="text" className={`border p-2 text-[12px] ${error && !name ? 'border-2 border-red-500' : 'border-gray-300'}`}
                        placeholder="Expense Name" value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                            if (error) setError(false);
                        }}
                        aria-label="Expense Name" />
                    {error && !name.trim() && <Fragment>
                        <span className="text-red-500 text-sm mt-1">Name is required!</span>
                    </Fragment>}
                </div>

                <div className="flex flex-col w-full md:w-32">
                    <input type="number" className={`border p-2 text-[12px] justify-center w-full md:w-32 ${error && !amount ? 'border-2 border-red-500' : 'border-gray-300'}`}
                        placeholder="Expense Amount" value={amount} onChange={(e) => {
                            setAmount(e.target.value)
                            if (error) setError(false);
                        }} aria-label="Amount" />

                    {error && !amount.trim() && <Fragment>
                        <span className="text-red-500 text-xs mt-1">Amount Required!</span>
                    </Fragment>}
                </div>
                <button onClick={handleAdd}
                    className="bg-black text-white px-6 py-2 font-bold rounded-lg w-full md:w-auto" aria-label="add-button">ADD</button>
            </div>

            <div className="border-t pt-4">

                {loading ? (
                    <p className="text-gray-500 italic">Loading...</p>
                ) : expenses.length === 0 ? (
                    <p className="text-red-700 font-semibold">No Data Found</p>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2">Description</th>
                                <th className="py-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(ex => (
                                <tr key={ex.id} className="border-b">
                                    <td className="py-2">{ex.name}</td>
                                    <td className="py-2">₹{ex.amount}</td>
                                    <td className="py-2 text-right">
                                        <button onClick={() => handleDelete(ex.id)} className="text-sm text-red-600 font-bold hover:bg-red-700/20 p-1 rounded-2xl" aria-label="delete-button">Delete Expense</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default ExpenseTracker;