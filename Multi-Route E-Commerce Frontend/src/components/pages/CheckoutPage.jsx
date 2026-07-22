import { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

function CheckoutPage() {
    const { cart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const handleOrder = () => {
        alert("Premium Order Placed Successfully via Secure Guard Route!🎉")
        clearCart();
        navigate("/shop");
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <h2 className="text-2xl font-bold mb-4">Your Cart is empty</h2>
                <button onClick={() => navigate("/shop")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full text-md hover:bg-blue-800 transition-colors cursor-pointer shadow-lg">Begin Shopping →</button>
            </div>
        )
    }

    return (
        <div className="max-w-xl mx-auto mt-10 px-4">
            <div className="mb-8">
                <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest">
                    🔒Secure Checkout Lane
                </span>
                <h2 className="text-3xl font-extrabold text-gray-900 mt-1">Review & Pay</h2>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
                <div className="space-y-6">
                    <div className="flex justify-between text-gray-600">
                        <span>Total Items</span>
                        <span className="font-semibold">{cart.length}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold border-t border-gray-100 pt-6">
                        <span>Amount Payable: </span>
                        <span className="text-emerald-600">${total.toFixed(2)}</span>
                    </div>
                </div>
                <button onClick={handleOrder} className="w-full mt-8 bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg active:scale-95">Authorize & Pay</button>
            </div>
            <p className="text-center text-gray-400 mt-8 text-sm">Your Payment is encrypted and secure.</p>
        </div>
    );
}

export default CheckoutPage;