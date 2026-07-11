import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import { AlertCircle, Eye, EyeOff } from "lucide-react";

import useAuthStore from '../../store/auth.js'
import useCartStore from "../../store/cart.js";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const isFormValid =  email.trim() !== "" && password !== "";
  const isSubmitDisabled = !isFormValid || loading;

  const { setUser } = useAuthStore();
  const { getCartItems } = useCartStore();

  const handleLogin = async () => {
    if(!email || !password){
      setError("Please enter your email and password");
      return;
    }

    try {
      setError(""); // ← clear previous error
      setLoading(true);
      
      const res = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // ← important, sends/receives cookies
          body: JSON.stringify({email, password})
      });

      const data = await res.json();
  
      if(data.success){
        console.log(data.user);
        setUser(data.user)

        await getCartItems();
        
        navigate('/shop')
    
      }else{
        setError(data.message)
      }

    } catch (error) {
      console.log("Login eror: ", error.message)
    } finally{
      setLoading(false);
      setEmail("");
      setPassword("");
    }
  }


  return (
    <div className="auth-form">

      <div className="auth-form__header">
        <h2 className="auth-form__title">Welcome Back</h2>
        <p className="auth-form__subtitle">Enter your credentials to access your ritual.</p>
      </div>

      <div className="auth-form__fields">

        {/* Email */}
        <div className="auth-field">
          <label className="auth-field__label" htmlFor="login-email">
            Email Address
          </label>
          <input
            className="auth-field__input"
            id="login-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="auth-field">
          <div className="auth-field__label-row">
            <label className="auth-field__label" htmlFor="login-password">
              Password
            </label>
            <a href="#" className="auth-field__forgot">Forgot password?</a>
          </div>
          <div className="auth-field__input-wrap">
            <input
              className="auth-field__input"
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="auth-field__eye-btn"
              onClick={() => setShowPassword(prev => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword
                ? <EyeOff size={16} strokeWidth={1.5} />
                : <Eye size={16} strokeWidth={1.5} />
              }
            </button>
          </div>
        </div>

        {/* Remember me */}
        <label className="auth-checkbox">
          <input
            className="auth-checkbox__input"
            type="checkbox"
            id="remember"
          />
          <span className="auth-checkbox__label">Remember me for 30 days</span>
        </label>

      </div>

      {error && <p className="auth-error">
        <AlertCircle size={16} />
        {error}
      </p>}

      <button 
        className="auth-submit-btn"
        onClick={handleLogin}
        disabled={isSubmitDisabled}
      >{loading ? "Logging in..." : "Login"}</button>

    </div>
  );
}