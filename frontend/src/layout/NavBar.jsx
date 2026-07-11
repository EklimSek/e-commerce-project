import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {

  const navigate = useNavigate();
  
  return (
    // Navigation Bar

    <nav className="navbar">
        <div className="nav-inner">
            <button 
                className="btn-link btn-nothing"
                onClick={() => navigate('/')}
            >Home</button>
            <button 
                className="btn-link btn-nothing"
                onClick={() => navigate('/shop')}
            >All Products</button>
            <button 
                className="btn-link btn-nothing"
                onClick={() => navigate('/shop?page=1&category=cleanser')}
            >Cleansers</button>
            <button 
                className="btn-link btn-nothing"
                onClick={() => navigate('/shop?page=1&category=moisturizer')}
            >Moisturizers</button>
            <button 
                className="btn-link btn-nothing"
                onClick={() => navigate('/shop?page=1&category=serum')}
            >Serums</button>
            <button 
                className="btn-link btn-nothing"
                onClick={() => navigate('/shop?page=1&category=toner')}
            >Toners</button>
            <button 
                className="btn-link btn-nothing"
                onClick={() => navigate('/shop?page=1&category=mask')}
            >Masks</button>
        </div>
    </nav>

  )
}

export default NavBar
