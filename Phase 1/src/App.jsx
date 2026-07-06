import KanbanBoard from "./components/pages/KanbanBoard";

function App(){
    return(
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
           <div className="max-w-6xl mx-auto">
            <h1 className="text-center text-3xl font-bold tracking-wide text-black mb-10">KANBAN TASK BOARD</h1>
             <KanbanBoard/>
           </div>
        </div>
    );
}
export default App;