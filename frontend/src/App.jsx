import { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
// Layout
import Header from './layout/Header.jsx';
import Main from './layout/Main.jsx';
import Footer from './layout/Footer.jsx';
import NavBar from './layout/NavBar.jsx';

import CartSidebar from './components/cart/CartSidebar.jsx'
import NavSidebar from './components/NavSidebar.jsx';
import SearchOverlay from "./components/SearchOverlay.jsx";

import useModalStore from './store/modal.js';
import useAuthStore from "./store/auth.js";
import useCartStore from "./store/cart.js";

import { Toaster } from "react-hot-toast";


function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { closeModal } = useModalStore();

  const isAuthPage = location.pathname === "/login";
  const { checkAuth } = useAuthStore();
  const { setCart, clearCart } = useCartStore();
  
  // handle esc key
  useEffect(() => {

    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEsc);

    // Cleanup Function 
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };

  }, [closeModal]);

  // On load run to check if the JWT cookie is still valid
  useEffect(() => {
      checkAuth().then((result) => {
          if (result.authenticated) {
              setCart(result.cart);
          } else if (result.wasLoggedIn) {
              clearCart();
          }
      });
  }, [checkAuth]);

  // Checking if the user is still valid for every request
  useEffect(() => {
    const handleAuthExpired = () => {
        useAuthStore.getState().clearUser();
        useCartStore.getState().clearCart();
        navigate("/login");
    };

    window.addEventListener("auth:expired", handleAuthExpired);
    return () => window.removeEventListener("auth:expired", handleAuthExpired);
  }, []);

  if(isAuthPage) return <Main/>;
  
  return (
    <>
      <Toaster position="top-center" />

      {/* Header */}
      <Header />

      <SearchOverlay/>

      {/* Navigation */}
      <NavBar/>

      {/* Main */}
      <Main />

      {/* Footer */}
      <Footer />

      <CartSidebar/>

      <NavSidebar/>
    </>
  );
}

export default App;
