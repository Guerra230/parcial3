import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    // simulación: navegar al home
    navigate('/');
  };

  return (
    <div className="login">
      <div className="login__card">
        <header className="login__head">
          <span className="login__icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#0a1838" strokeWidth="1.6" />
              <path
                d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"
                stroke="#0a1838"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <h1>Sign in / Register</h1>
        </header>

        <form className="login__form" onSubmit={handleSubmit}>
          <label className="login__label">Email or Phone number</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="login__input"
          />
          <button type="submit" className="login__submit">
            Continue
          </button>
        </form>

        <div className="login__divider">
          <span>Or</span>
        </div>

        <div className="login__providers">
          <button className="login__provider" type="button">
            <span className="login__provider-icon">G</span>
            Continue with Google
          </button>
          <button className="login__provider" type="button">
            <span className="login__provider-icon login__provider-icon--fb">
              f
            </span>
            Continue with Facebook
          </button>
          <button className="login__provider" type="button">
            <span className="login__provider-icon login__provider-icon--apple">

            </span>
            Continue with Apple
          </button>
        </div>

        <Link to="#" className="login__trouble">
          Trouble to signing in?
        </Link>

        <p className="login__terms">
          By continuing, you agree to our{' '}
          <a href="#">Terms of Use</a> and authorize the processing of your
          personal data in accordance with <a href="#">Privacy Policy</a>. For
          further details on the purposes and methods of data processing, your
          rights, and how to exercise them, visit our Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
