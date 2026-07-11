import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Pages
import HomePage from '../pages/HomePage.jsx';
import ShopPage from '../pages/ShopPage.jsx';
import CartPage from '../pages/CartPage.jsx';
import CheckoutPage from '../pages/CheckoutPage.jsx';
import ProductDetailPage from '../pages/ProductDetailPage.jsx';
import AuthPage from '../pages/AuthPage.jsx';

const Main = () => {
  return (
    <main>

      <Routes>
        <Route path="/login" element={<AuthPage  />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>

    </main>
  )
}

export default Main