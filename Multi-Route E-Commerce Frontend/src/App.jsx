import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import HomePage from './components/pages/HomePage';
import ShopPage from './components/pages/ShopPage';
import ProductCard from './components/common/ProductCard';
import ContactPage from './components/pages/ContactPage';
import ProductView from './components/pages/ProductView';
import { CartProvider } from './context/CartContext';
import CartPage from './components/pages/CartPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import CheckoutPage from './components/pages/CheckoutPage';
import LoginPage from './components/pages/LoginPage';



function App() {
  return (
    <AuthProvider>
    <CartProvider>
      <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/contact" element={<ContactPage/>} />
        <Route path="/product/:id" element={<ProductView/>} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage/></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
      </Router>
    </CartProvider>
    </AuthProvider>
  );
}
export default App
