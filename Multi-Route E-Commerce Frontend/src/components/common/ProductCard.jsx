import React from "react";

function ProductCard({ product }) {
    return (
        <div className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition">
            <img src={product.thumbnail} alt={product.title} className="w-full object-contain h-48 rounded bg-gray-50" />
            <h2 className="text-lg font-bold mt-2">{product.title}</h2>
            <p className="text-black">${product.price}</p>
        </div>
    );
}

export default ProductCard;