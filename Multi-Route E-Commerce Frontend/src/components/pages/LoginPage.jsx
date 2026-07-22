import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

function LoginPage(){
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = () =>{
        login();
        navigate("/checkout");
    };

    return(
        <div className="flex items-center justify-center h-[80vh] px-4">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="text-blue-600" size={32}/>
                </div>
                <h1 className="text-2xl font-bold mb-2">Member Access</h1>
                <p className="text-gray-600 mb-8">Securely sign in to access your checkout lane and complete your purchase!</p>
                <button onClick={handleLogin} className="w-full bg-blue-800 text-white py-4 rounded-xl font-semibold hover:bg-blue-900 transition-all active:scale-95 shadow-lg cursor-pointer">Login as Guest🔑</button>
            </div>
        </div>
    )
}
export default LoginPage;