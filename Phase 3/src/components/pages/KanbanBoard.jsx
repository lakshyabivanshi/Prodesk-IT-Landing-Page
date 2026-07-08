import { useEffect, useState } from "react";
import { DndContext, useDraggable, useDroppable, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";


function DraggableCard({ task, getPriorityClass, editingId, setEditingId, editingText, setEditingText, handleSaveEdit, handleDeleteTask }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-white border border-gray-200 rounded-lg p-5 shadow-xs flex flex-col gap-3 ${getPriorityClass(task.priority)}`}>
            {editingId === task.id ? (
                <input type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={() => handleSaveEdit(task.id)}
                    onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                    autoFocus
                    className="text-sm p-1 border border-blue-400 rounded outline-none w-full"
                />
            ) : (
                <p onClick={() => { setEditingId(task.id); setEditingText(task.title) }}
                    className="text-sm text-gray-700 font-medium break-words cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors" title="Click to edit">{task.title}</p>
            )}
            <div className="flex justify-end items-center mt-auto">
                <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-600 p-2 text-sm font-semibold transition-colors hover:bg-red-100 rounded-lg">REMOVE</button>
            </div>
        </div>
    );
}

function DroppableColumn({ id, title, count, tasks, bgClass, headerBg, headerText, badgeBg, badgeText, searchTerm, getPriorityClass, editingId, setEditingId, editingText, setEditingText, handleSaveEdit, handleDeleteTask, emptyMessage, children }) {
    const { setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className={`${bgClass} rounded-xl shadow-md p-5 min-h-[450px] flex flex-col`}>
            <h2 className={`text-center text-sm font-semibold tracking-wider p-3 rounded-lg mb-5 ${headerBg} ${headerText} flex justify-between items-center px-4`}>
                <span>{title}</span>
                <span className={`${badgeBg} ${badgeText} px-2 py-0.5 rounded-full text-xs`}>{count}</span>
            </h2>

            <div className="flex flex-col gap-4 flex-grow mb-4">
                {tasks.length === 0 ? (
                    <p className="text-center text-xs text-gray-400 italic my-auto">{searchTerm ? "No Matching Tasks Found" : emptyMessage}</p>
                ) : (
                    tasks.map(task => (
                        <DraggableCard
                            key={task.id}
                            task={task}
                            getPriorityClass={getPriorityClass}
                            editingId={editingId}
                            setEditingId={setEditingId}
                            editingText={editingText}
                            setEditingText={setEditingText}
                            handleSaveEdit={handleSaveEdit}
                            handleDeleteTask={handleDeleteTask} />
                    ))
                )}
            </div>
            {children}
        </div>
    )
}

function KanbanBoard({ searchTerm = '' }) {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem("kanban_tasks");
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [inputValue, setInputValue] = useState('');
    const [priorityValue, setPriorityValue] = useState('Low');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');


    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );



    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;
        const taskId = active.id;
        const newStatus = over.id;

        setTasks(prevTasks => prevTasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
        ));
    };

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
        setTasks(tasks.map(task => task.id === id ? { ...task, title: editingText.trim() } : task));
        setEditingId(null);
    };

    const getPriorityClass = (priority) => {
        if (priority === 'High') return 'border-l-4 border-l-red-500';
        if (priority === 'Medium') return 'border-l-4 border-l-amber-500';
        return 'border-l-4 border-l-green-500';
    };


    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const todoTasks = filteredTasks.filter(t => t.status === 'todo');
    const inProgressTasks = filteredTasks.filter(t => t.status === 'inprogress');
    const doneTask = filteredTasks.filter(t => t.status === 'done');

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <DroppableColumn
                    id="todo"
                    title="TO DO"
                    count={todoTasks.length}
                    tasks={todoTasks}
                    bgClass="bg-blue-50"
                    headerBg="bg-blue-100"
                    headerText="text-blue-700"
                    badgeBg="bg-blue-200"
                    badgeText="text-blue-700"
                    searchTerm={searchTerm}
                    getPriorityClass={getPriorityClass}
                    editingId={editingId}
                    setEditingId={setEditingId}
                    editingText={editingText}
                    setEditingText={setEditingText}
                    handleSaveEdit={handleSaveEdit}
                    handleDeleteTask={handleDeleteTask}
                    emptyMessage="No Task to Do">

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
                </DroppableColumn>

                <DroppableColumn
                    id="inprogress"
                    title="IN PROGRESS"
                    count={inProgressTasks.length}
                    tasks={inProgressTasks}
                    bgClass="bg-amber-50"
                    headerBg="bg-amber-100"
                    headerText="text-amber-700"
                    badgeBg="bg-amber-200"
                    badgeText="text-amber-700"
                    searchTerm={searchTerm}
                    getPriorityClass={getPriorityClass}
                    editingId={editingId}
                    setEditingId={setEditingId}
                    editingText={editingText}
                    setEditingText={setEditingText}
                    handleSaveEdit={handleSaveEdit}
                    handleDeleteTask={handleDeleteTask}
                    emptyMessage="No Task In Progress"></DroppableColumn>


                <DroppableColumn
                    id="done"
                    title="DONE"
                    count={doneTask.length}
                    tasks={doneTask}
                    bgClass="bg-green-50"
                    headerBg="bg-green-100"
                    headerText="text-green-700"
                    badgeBg="bg-green-200"
                    badgeText="text-green-700"
                    searchTerm={searchTerm}
                    getPriorityClass={getPriorityClass}
                    editingId={editingId}
                    setEditingId={setEditingId}
                    editingText={editingText}
                    setEditingText={setEditingText}
                    handleSaveEdit={handleSaveEdit}
                    handleDeleteTask={handleDeleteTask}
                    emptyMessage="No Completed Tasks"></DroppableColumn>
            </div>
        </DndContext>

    );
}

export default KanbanBoard;