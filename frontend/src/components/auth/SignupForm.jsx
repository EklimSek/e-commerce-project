import { useState } from "react";
import { Check, X, Eye, EyeOff, AlertCircle} from "lucide-react";
import { useNavigate } from "react-router-dom";

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8)           score++;
  if (/[A-Z]/.test(password))         score++;
  if (/[0-9]/.test(password))         score++;
  if (/[^A-Za-z0-9]/.test(password))  score++;

  const levels = [
    { label: "",       color: "" },
    { label: "Weak",   color: "var(--color-tertiary-dark)" },
    { label: "Fair",   color: "#C8A84B" },
    { label: "Good",   color: "var(--color-secondary)" },
    { label: "Strong", color: "var(--color-secondary-dark)" },
  ];

  return { score, ...levels[score] };
};

const getStrengthHint = (score) => {
  if (score === 0) return "";
  if (score === 1) return "Add uppercase letters, numbers or symbols";
  if (score === 2) return "Add a number or special character";
  if (score === 3) return "Add a special character to make it stronger";
  return "Great password";
};

export default function SignupForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = getPasswordStrength(password);
  const passwordsMatch    = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const isFormValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    password !== "" &&
    confirmPassword !== "" &&
    password === confirmPassword;
  const isSubmitDisabled = !isFormValid || loading;


  const handleSignUp = async () => {

    if(!firstName || !lastName || !email || !password || !confirmPassword){
      setError("Please enter all input fields");
      return;
    }

    if(password !== confirmPassword){
      setError("Your password is not match");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // ← important, sends/receives cookies
          body: JSON.stringify({ firstName, lastName, email, password })
      })

      const data = await res.json();
  
      if(data.success){
        navigate('/shop')
      }else{
        setError(data.message)
      }

    } catch (error) {
      console.log("Signup error: ", error.message)
    }finally{
      // Reset everything 
      setLoading(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("")
    }
    




  }

  return (
    <div className="auth-form">

      <div className="auth-form__header">
        <h2 className="auth-form__title">Join the Community</h2>
        <p className="auth-form__subtitle">
          Start your personalized skincare journey today.
        </p>
      </div>

      <div className="auth-form__fields">

        {/* Name row */}
        <div className="auth-field-row">
          <div className="auth-field">
            <label className="auth-field__label">First Name</label>
            <input 
              className="auth-field__input" 
              type="text" 
              placeholder="Jane"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label className="auth-field__label">Last Name</label>
            <input 
              className="auth-field__input" 
              type="text" 
              placeholder="Doe" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Email */}
        <div className="auth-field">
          <label className="auth-field__label">Email Address</label>
          <input 
            className="auth-field__input" 
            type="email" 
            placeholder="name@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password + strength bar */}
        <div className="auth-field">
          <label className="auth-field__label">Password</label>
          <div className="auth-field__input-wrap">
            <input
              className="auth-field__input auth-field__input--icon"
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

          {password.length > 0 && (
            <div className="password-strength">
              <div className="password-strength__bar-track">
                {[1, 2, 3, 4].map((segment) => (
                  <div
                    key={segment}
                    className="password-strength__bar-segment"
                    style={{
                      backgroundColor:
                        segment <= strength.score
                          ? strength.color
                          : "var(--color-neutral-subtle)",
                    }}
                  />
                ))}
              </div>
              <div className="password-strength__meta">
                {strength.label && (
                  <span
                    className="password-strength__label"
                    style={{ color: strength.color }}
                  >
                    {strength.label}
                  </span>
                )}
                <span className="password-strength__hint">
                  {getStrengthHint(strength.score)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm password + match indicator */}
        <div className="auth-field">
          <label className="auth-field__label">Confirm Password</label>
          <div className="auth-field__input-wrap">
            <input
              className={`auth-field__input auth-field__input--icon ${
                passwordsMismatch ? "auth-field__input--error" : ""
              } ${passwordsMatch ? "auth-field__input--success" : ""}`}
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* Eye toggle — always visible */}
            <button
              type="button"
              className="auth-field__eye-btn"
              onClick={() => setShowConfirm(prev => !prev)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm
                ? <EyeOff size={16} strokeWidth={1.5} />
                : <Eye size={16} strokeWidth={1.5} />
              }
            </button>

            {/* Match/mismatch icon — shifts left of eye button when visible */}
            {passwordsMatch && (
              <span className="auth-field__status auth-field__status--success auth-field__status--left">
                <Check size={16} strokeWidth={2} />
              </span>
            )}
            {passwordsMismatch && (
              <span className="auth-field__status auth-field__status--error auth-field__status--left">
                <X size={16} strokeWidth={2} />
              </span>
            )}
          </div>
          {passwordsMismatch && (
            <p className="auth-field__error-msg">Passwords do not match</p>
          )}
        </div>

      </div>

      {error && <p className="auth-error">
        <AlertCircle size={16} />
        {error}
      </p>}


      <button
        className="auth-submit-btn"
        onClick={handleSignUp}
        disabled={isSubmitDisabled}
        type="button"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>

    </div>
  );
}