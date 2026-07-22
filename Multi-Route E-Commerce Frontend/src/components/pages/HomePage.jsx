import { useNavigate } from "react-router-dom";

function HomePage(){
    const navigate = useNavigate();
    return(
        <div className="flex flex-col p-3 items-center justify-center min-h-[calc(100vh-76px)] text-center bg-gray-50">

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Welcome To Our Store</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">Explore Our Latest Collections Of Premium Products!</p>
        <button 
        onClick={()=>navigate('/shop')}
        className="bg-blue-600 text-white px-4 py-2 rounded-full text-md hover:bg-blue-800 transition-colors cursor-pointer shadow-lg">
            Begin Shopping →
        </button>
        </div>
    );
}

export default HomePage;