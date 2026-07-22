import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CartPage() {
    const { cart, removeFromCart } = useContext(CartContext);
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const navigate = useNavigate();

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
            {cart.length === 0 ? (
                <p>Your Cart is empty.</p>
            ) : (
                <>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    {cart.map((item, index) => (
                        <div key={index} className="flex items-center justify-between border-b border-gray-100 py-4 last:border-none">
                            <span className="font-medium flex-1 pr-4">{item.title}</span>
                            <span className="font-semibold w-24 text-right">${item.price}</span>
                            <button onClick={() => removeFromCart(index)} className=" ml-6 text-red-500 hover:text-red-700 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"><Trash2 size={20} /></button>
                        </div>
                    ))}
                    </div>
                    <div className="flex justify-between mt-6 items-center">
                        <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
                        <button onClick={() => navigate("/checkout")} className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 md:px-6 py-4 cursor-pointer font-semibold">Checkout →</button>
                    </div>

                </>
            )}
        </div>
    )
}

export default CartPage;