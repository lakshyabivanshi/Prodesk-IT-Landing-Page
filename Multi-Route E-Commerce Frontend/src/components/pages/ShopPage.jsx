import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../common/ProductCard';

function ShopPage() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://dummyjson.com/products')
            .then((res) => res.json())
            .then((data) => setProducts(data.products));
    }, []);

    return (
        <div className='p-8'>
            <h1 className='text-3xl font-semibold text-center mb-8'>Our Collections</h1>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {products.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => navigate(`/product/${product.id}`)}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ShopPage;