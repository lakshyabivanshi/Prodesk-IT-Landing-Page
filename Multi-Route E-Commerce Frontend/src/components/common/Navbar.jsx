
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { useContext } from 'react';
import {ShoppingCart} from 'lucide-react';

function Navbar(){
    const {cart} = useContext(CartContext);

    return(
        <nav className='flex justify-between items-center p-4.5 bg-gray-900 text-white shadow-lg'>
            <h1 className='text-lg font-semibold'>Shopzy</h1>
            <ul className='flex gap-3 md:gap-6'>
                <li><Link to="/" className="hover:text-blue-400 text-sm">Home</Link></li>
                <li><Link to="/shop" className="hover:text-blue-400 text-sm">Shop</Link></li>
                <li><Link to="/contact" className="hover:text-blue-400 text-sm">Contact</Link></li>
                <li><Link to="/checkout" className="hover:text-blue-400 text-sm">Checkout</Link></li>
                <li><Link to="/cart" className='relative flex items-center hover:text-blue-400'>
                <ShoppingCart size={22}/>
                {cart.length > 0 && (
                    <span className='absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full'>{cart.length}</span>
                )}
                </Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;