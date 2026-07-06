import { useState} from "react";

function KanbanBoard(){
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState('');


const handleAddTask = (e) =>{
    e.preventDefault();
    if(!inputValue.trim()) return;

const newTask = {
    id: Date.now(),
    title: inputValue.trim(),
    status: 'todo' //new task always go in todo 
};
setTasks([...tasks, newTask]);
setInputValue('');
};

const handleDeleteTask = (id)=> {
    setTasks(tasks.filter(task => task.id !== id));
};

const handleMoveTask = (id, direction) =>{
    setTasks(tasks.map(task => {
        if(task.id === id){
            if(task.status === 'todo' && direction === 'forward'){
                return{...task, status: 'inprogress'};
            }else if(task.status === 'inprogress'){
                return {...task, status: direction === 'forward' ? 'done' : 'todo'};
            }else if(task.status === 'done' && direction === 'backward'){
                return{...task, status: 'inprogress'}; 
            }
        }
        return task;
    }));
};

return(
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/*Column 1 - TO DO*/}
        <div className="bg-blue-50 rounded-xl shadow-md p-5 min-h-[450px] flex flex-col">
            <h2 className="text-center text-sm font-semibold tracking-wider p-3 rounded-lg mb-5 bg-blue-100 text-blue-700">TO DO</h2>

            {/*Render Cards*/}
            <div className=" flex flex-col gap-4 flex-grow mb-4">
                {tasks.filter(t => t.status === 'todo').map(task =>(
                    <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs flex flex-col gap-3">
                        <p className="text-sm text-gray-700 font-medium wrap-break-word">{task.title}</p>
                        <div className="flex justify-between items-center mt-auto">
                        <button onClick={()=> handleMoveTask(task.id, 'forward')} className="bg-gray-100 border border-gray-200 text-gray-600 rounded-md w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors font-semibold">→</button>

                        <button onClick={()=> handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-600 p-2 text-sm font-semibold transition-colors hover:bg-red-100 rounded-lg">REMOVE</button>
                        </div>
                    </div>
                ))}
            </div>
                {/*Input Form*/}
                <form onSubmit={handleAddTask} className="flex gap-2 mt-auto">
                    <input type="text" placeholder="Enter Task Name" value={inputValue} onChange={(e)=>setInputValue(e.target.value)} className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-600"/>
                    <button type="submit" className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md text-sm whitespace-nowrap hover:bg-blue-700 transition-colors">ADD TASK</button>
                </form>
        </div>

        {/*Column 2 - IN PROGRESS*/}
        <div className="bg-amber-50 rounded-xl shadow-md p-5 min-h-[450px] flex flex-col">
            <h2 className="text-center text-sm font-semibold tracking-wider p-3 rounded-lg mb-5 bg-amber-100 text-amber-800">IN PROGRESS</h2>

            {/*Render Cards*/}
            <div className="flex flex-col gap-4 flex flex-grow mb-4">
                {tasks.filter(t => t.status === 'inprogress').map(task =>(
                    <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col gap-3">
                        <p className="text-sm text-gray-700 font-medium break-words">{task.title}</p>
                        <div className="flex justify-start items-center gap-2 mt-auto">
                            <button onClick={() => handleMoveTask(task.id, 'backward')} className="bg-gray-100 border border-gray-200 text-gray-700 rounded-md w-8 h-8 flex items-center justify-center font-bold hover:bg-gray-200 transition-colors">←</button>

                            <button onClick={() => handleMoveTask(task.id, 'forward')} className="bg-gray-100 border border-gray-200 text-gray-700 rounded-md w-8 h-8 flex items-center justify-center font-bold hover:bg-gray-200 transition-colors">→</button>

                            <button onClick={()=> handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-600 p-2 text-sm font-semibold transition-colors hover:bg-red-100 rounded-lg ml-auto">REMOVE</button>
                    </div>
                    </div>
                ))}
            </div>
            </div>

            {/*Column 3 - DONE*/}

              <div className="bg-green-50 rounded-xl shadow-md p-5 min-h-[450px] flex flex-col">
            <h2 className="text-center text-sm font-semibold tracking-wider p-3 rounded-lg mb-5 bg-green-100 text-green-800">DONE</h2>

            {/*Render Cards*/}

            <div className="flex flex-col gap-4 flex-grow mb-4">
                {tasks.filter(t=> t.status === 'done').map(task => (
                    <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col gap-3">
                        <p className=" text-sm text-gray-700 font-medium break-words">{task.title}</p>
                        <div className="flex justify-between items-center mt-auto">
                            <button onClick={() => handleMoveTask(task.id, 'backward')} className="bg-gray-100 border border-gray-200 text-gray-700 rounded-md w-8 h-8 flex items-center justify-center font-bold hover:bg-gray-200 transition-colors">←</button>

                            <button onClick={()=> handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-600 p-2 text-sm font-semibold transition-colors hover:bg-red-100 rounded-lg ml-auto">REMOVE</button>
                        </div>
                    </div>
                ))}
            </div>
            </div>
    </div>
);
}
export default KanbanBoard;