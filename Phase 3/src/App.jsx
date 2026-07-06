import { useState } from "react";
import KanbanBoard from "./components/pages/KanbanBoard";
import SearchBar from "./components/common/SearchBar";
function App(){
    const [searchTerm, setSearchTerm] = useState('');

    return(
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <h1 className="text-center text-3xl font-bold tracking-wide text-black mb-10">KANBAN TASK BOARD</h1>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

             <KanbanBoard searchTerm={searchTerm}/>
           </div>
        
    );
}
export default App;