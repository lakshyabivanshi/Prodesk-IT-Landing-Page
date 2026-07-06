import React from 'react'

function SearchBar({searchTerm, setSearchTerm}){
    return(
        <div className="w-full max-w-md mx-auto mb-6">
            <div className="relative">
                <input type="text"
                placeholder="Search Tasks By Name..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 text-sm border border-gray-300 rounded-xl shadow-xs outline-none focus:border-blue-500 focus:ring-blue-100 bg-white text-shadow-gray-800 transition-all"/>
            </div>
        </div>
    );
}

export default SearchBar;