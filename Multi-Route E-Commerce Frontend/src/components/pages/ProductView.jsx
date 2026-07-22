import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../../context/CartContext";


function ProductView() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        fetch(`https://dummyjson.com/products/${id}`)
            .then((res) => res.json())
            .then((data) => setProduct(data));
    }, [id]);

    if (!product) return <div className="flex justify-center items-center h-screen">
        <div className="h-10 w-10 flex animate-spin rounded-full border-4 justify-center border-blue-600 border-t-transparent"></div>
    </div>
    return (
        <div className="max-w-5xl mx-auto mt-10 px-4 md:px-6">
            <div className="border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 bg-white">
                <div className="flex flex-col md:flex-row gap-10">
                    <img src={product.thumbnail} alt={product.title} className="w-full md:w-1/2 h-80 object-contain rounded" />

                    <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{product.title}</h1>
                        <p className="text-2xl font-semibold text-blue-600 my-4 mb-4">${product.price}</p>
                        <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">{product.description}</p>
                        <div className="flex justify-center mt-8">
                            <button onClick={() => addToCart(product)} className="bg-blue-700 text-white px-10 py-3 rounded-full font-bold hover:bg-blue-800 transition duration-300 transform hover:scale-105 shadow-lg cursor-pointer">Add to Cart 🛍️</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ProductView;