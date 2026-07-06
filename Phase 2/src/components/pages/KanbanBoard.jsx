import { useEffect, useState } from "react";

function KanbanBoard() {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem("kanban_tasks");
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [inputValue, setInputValue] = useState('');
    const [priorityValue, setPriorityValue] = useState('Low');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');



    useEffect(() => {
        localStorage.setItem("kanban_tasks", JSON.stringify(tasks));
    }, [tasks]);


    const handleAddTask = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newTask = {
            id: Date.now(),
            title: inputValue.trim(),
            status: 'todo', //new task always go in todo 
            priority: priorityValue
        };
        setTasks([...tasks, newTask]);
        setInputValue('');
        setPriorityValue('Low');
    };

    const handleDeleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const handleSaveEdit = (id) => {
        if (!editingText.trim()) return;
        setTasks(tasks.map(task => task.id === id ? { ...task, title: editingText } : task));
        setEditingId(null);
    };

    const handleMoveTask = (id, direction) => {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                if (task.status === 'todo' && direction === 'forward') {
                    return { ...task, status: 'inprogress' };
                } else if (task.status === 'inprogress') {
                    return { ...task, status: direction === 'forward' ? 'done' : 'todo' };
                } else if (task.status === 'done' && direction === 'backward') {
                    return { ...task, status: 'inprogress' };
                }
            }
            return task;
        }));
    };

    const getPriorityClass = (priority) => {
        if (priority === 'High') return 'border-l-4 border-l-red-500';
        if (priority === 'Medium') return 'border-l-4 border-l-amber-500';
        return 'border-l-4 border-l-green-500';
    };

    const todoTasks = tasks.filter(t => t.status === 'todo');
    const inProgressTasks = tasks.filter(t => t.status === 'inprogress');
    const doneTask = tasks.filter(t => t.status === 'done');
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/*Column 1 - TO DO*/}
            <div className="bg-blue-50 rounded-xl shadow-md p-5 min-h-[450px] flex flex-col">
                <h2 className="text-center text-sm font-semibold tracking-wider p-3 rounded-lg mb-5 bg-blue-100 text-blue-700 flex justify-between items-center px-4">
                    <span>TO DO</span>
                    <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs">{todoTasks.length}</span>
                </h2>

                {/*Render Cards*/}
                <div className=" flex flex-col gap-4 flex-grow mb-4">
                    {todoTasks.length === 0 ? (
                        <p className="text-center text-xs text-gray-400 italic my-auto">No Task To Do</p>
                    ) : (
                        todoTasks.map(task => (
                            <div key={task.id} className={`bg-white border border-gray-200 rounded-lg p-5 shadow-xs flex flex-col gap-3 ${getPriorityClass(task.priority)}`}>
                                {editingId === task.id ? (
                                    <input type="text" value={editingText} onChange={(e) => setEditingText(e.target.value)} onBlur={() => handleSaveEdit(task.id)} onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(task.id)} autoFocus className="text-sm p-1 border border-blue-400 rounded outline-none w-full" />
                                ) : (
                                    <p onClick={() => { setEditingId(task.id); setEditingText(task.title); }} className="text-sm text-gray-700 font-medium wrap-break-word cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors" title="Click to edit">{task.title}</p>
                                )
                                }
                                <div className="flex justify-between items-center mt-auto">
                                    <button onClick={() => handleMoveTask(task.id, 'forward')} className="bg-gray-100 border border-gray-200 text-gray-600 rounded-md w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors font-semibold">→</button>

                                    <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-600 p-2 text-sm font-semibold transition-colors hover:bg-red-100 rounded-lg">REMOVE</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/*Input Form*/}
                <form onSubmit={handleAddTask} className="flex flex-col gap-2 mt-auto bg-white p-3 rounded-lg border border-gray-200 shadow-sm w-full">
                    <input type="text" placeholder="Enter Task Name" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-600 mb-2" />
                    <div className="flex  flex-col w-full gap-2">
                        <p className="text-[12px]">Select Task Priority</p>
                        <select value={priorityValue} onChange={(e) => setPriorityValue(e.target.value)} className="flex flex-row px-2 py-2 border border-gray-300 rounded-md text-xs bg-gray-50 text-gray-700 outline-none focus:border-blue-600 flex-grow">

                            <option value="Low">Low (Green)</option>
                            <option value="Medium">Medium (Yellow)</option>
                            <option value="High">High (Red)</option>
                        </select>
                        <button type="submit" className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md text-sm whitespace-nowrap hover:bg-blue-800 transition-colors">ADD TASK</button>
                    </div>
                </form>
            </div>

            {/*Column 2 - IN PROGRESS*/}
            <div className="bg-amber-50 rounded-xl shadow-md p-5 min-h-[450px] flex flex-col">
                <h2 className="text-center text-sm font-semibold tracking-wider p-3 rounded-lg mb-5 bg-amber-100 text-amber-700 flex justify-between items-center px-4">
                    <span>IN PROGRESS</span>
                    <span className="bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full text-xs">{inProgressTasks.length}</span>
                </h2>

                {/*Render Cards*/}
                <div className="flex flex-col gap-4 flex-grow mb-4">
                    {inProgressTasks.length === 0 ? (
                        <p className="text-center text-xs text-gray-400 italic my-auto">No Task In Progress</p>
                    ) : (
                        inProgressTasks.map(task => (
                            <div key={task.id} className={`bg-white border border-gray-200 rounded-lg p-5 shadow-xs flex flex-col gap-3 ${getPriorityClass(task.priority)}`}>

                                {editingId === task.id ? (
                                    <input type="text" value={editingText} onChange={(e) => setEditingText(e.target.value)} onBlur={() => handleSaveEdit(task.id)} onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(task.id)} autoFocus className="text-sm p-1 border border-blue-400 rounded outline-none w-full" />
                                ) : (
                                    <p onClick={() => { setEditingId(task.id); setEditingText(task.title); }} className="text-sm text-gray-700 font-medium wrap-break-word cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors" title="Click to edit">{task.title}</p>
                                )}

                                <div className="flex justify-between items-center mt-auto gap-2">
                                    <button onClick={() => handleMoveTask(task.id, 'backward')} className="bg-gray-100 border border-gray-200 text-gray-600 rounded-md w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors font-semibold">←</button>

                                    <button onClick={() => handleMoveTask(task.id, 'forward')} className="bg-gray-100 border border-gray-200 text-gray-600 rounded-md w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors font-semibold">→</button>

                                    <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-600 p-2 text-sm font-semibold transition-colors hover:bg-red-100 rounded-lg ml-auto">REMOVE</button>
                                </div>
                            </div>

                        ))
                    )}
                </div>
            </div>

            {/*Column 3 - DONE*/}

            <div className="bg-green-50 rounded-xl shadow-md p-5 min-h-[450px] flex flex-col">
                <h2 className="text-center text-sm font-semibold tracking-wider p-3 rounded-lg mb-5 bg-green-100 text-green-700 flex justify-between items-center px-4">
                    <span>DONE</span>
                    <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full text-xs">{doneTask.length}</span>
                </h2>

                {/*Render Cards*/}

                <div className="flex flex-col gap-4 flex-grow mb-4">
                    {doneTask.length === 0 ? (
                        <p className="text-center text-xs text-gray-400 italic my-auto">No Completed Task</p>
                    ) : (
                        doneTask.map(task => (
                            <div key={task.id} className={`bg-white border border-gray-200 rounded-lg p-5 shadow-xs flex flex-col gap-3 ${getPriorityClass(task.priority)}`}>

                                {editingId === task.id ? (
                                    <input type="text" value={editingText} onChange={(e) => setEditingText(e.target.value)} onBlur={() => handleSaveEdit(task.id)} onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(task.id)} autoFocus className="text-sm p-1 border border-blue-400 rounded outline-none w-full" />
                                ) : (
                                    <p onClick={() => { setEditingId(task.id); setEditingText(task.title); }} className="text-sm text-gray-700 font-medium wrap-break-word cursor-pointer hover: bg-gray-50 p-1 rounded transition-colors" title="Click to edit">{task.title}</p>
                                )}

                                <div className="flex justify-between items-center mt-auto gap-2">
                                    <button onClick={() => handleMoveTask(task.id, 'backward')} className="bg-gray-100 border border-gray-200 text-gray-600 rounded-md w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors font-semibold">←</button>

                                    <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-600 p-2 text-sm font-semibold transition-colors hover:bg-red-100 rounded-lg ml-auto">REMOVE</button>
                                </div>
                            </div>

                        ))
                    )}
                </div>
            </div>

        </div>

    );
}

export default KanbanBoard;