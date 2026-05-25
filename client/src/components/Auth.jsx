import { useState } from 'react';
import './Auth.css';
import shieldLogo from '../assets/shield-logo.png';
import authService from '../services/authService';
import { useTheme } from '../context/ThemeContext';

const Auth = () => {
    const { theme, toggleTheme } = useTheme();
    // State to control the sliding panel position
    const [isSignUpActive, setIsSignUpActive] = useState(false);

    // Form states for Sign Up
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'analyst'
    });

    // Form states for Sign In
    const [signinData, setSigninData] = useState({
        email: '',
        password: ''
    });

    // Loading and error states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handle Sign Up form submission
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const result = await authService.signup(
                signupData.name,
                signupData.email,
                signupData.password,
                signupData.role
            );

            if (result.success) {
                setSuccess('Account created successfully! Redirecting...');
                // Reset form
                setSignupData({ name: '', email: '', password: '', role: 'analyst' });

                // Redirect to dashboard or home page after 2 seconds
                setTimeout(() => {
                    window.location.href = '/dashboard'; // Change this to your dashboard route
                }, 2000);
            } else {
                setError(result.message || 'Signup failed. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle Sign In form submission
    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const result = await authService.signin(
                signinData.email,
                signinData.password
            );

            if (result.success) {
                setSuccess('Login successful! Redirecting...');
                // Reset form
                setSigninData({ email: '', password: '' });

                // Redirect to dashboard or home page after 1 second
                setTimeout(() => {
                    window.location.href = '/dashboard'; // Change this to your dashboard route
                }, 1000);
            } else {
                setError(result.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Signin error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container-centered">
            {/* Theme Toggle Button */}
            <div className="auth-theme-toggle">
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? (
                        <svg className="theme-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    ) : (
                        <svg className="theme-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    )}
                </button>
            </div>

            <div className={`container ${isSignUpActive ? "right-panel-active" : ""}`} id="container">

                {/* ----- SIGN UP FORM CONTAINER ----- */}
                <div className="form-container sign-up-container">
                    <form onSubmit={handleSignUp}>
                        <h1>Create Account</h1>

                        {error && isSignUpActive && <div className="error-message">{error}</div>}
                        {success && isSignUpActive && <div className="success-message">{success}</div>}

                        <input
                            type="text"
                            placeholder="Name"
                            value={signupData.name}
                            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                            required
                            disabled={loading}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            required
                            disabled={loading}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            required
                            minLength="6"
                            disabled={loading}
                        />

                        <button className="action-btn" type="submit" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>
                </div>

                {/* ----- SIGN IN FORM CONTAINER ----- */}
                <div className="form-container sign-in-container">
                    <form onSubmit={handleSignIn}>
                        <h1 id="signup_head">Sign in</h1>

                        {error && !isSignUpActive && <div className="error-message">{error}</div>}
                        {success && !isSignUpActive && <div className="success-message">{success}</div>}

                        <input
                            type="email"
                            placeholder="Email"
                            value={signinData.email}
                            onChange={(e) => setSigninData({ ...signinData, email: e.target.value })}
                            required
                            disabled={loading}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={signinData.password}
                            onChange={(e) => setSigninData({ ...signinData, password: e.target.value })}
                            required
                            disabled={loading}
                        />
                        <a href="#">Forgot your password?</a>
                        <button className="action-btn" type="submit" disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* ----- THE SLIDING OVERLAY CONTAINER ----- */}
                <div className="overlay-container">
                    <div className="overlay">

                        {/* OVERLAY LEFT (Visible on Sign Up) */}
                        <div className="overlay-panel overlay-left">
                            <img src={shieldLogo} alt="MicroSOC Logo" className="overlay-logo" />
                            <h1>MICRO SOC</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost-btn" onClick={() => {
                                setIsSignUpActive(false);
                                setError('');
                                setSuccess('');
                            }}>
                                Sign In
                            </button>
                        </div>

                        {/* OVERLAY RIGHT (Visible on Login) */}
                        <div className="overlay-panel overlay-right">
                            <img src={shieldLogo} alt="MicroSOC Logo" className="overlay-logo" />
                            <h1>MICRO SOC</h1>
                            <p>Initialize your security clearance to access the MicroSOC Command Center</p>
                            <button className="ghost-btn" onClick={() => {
                                setIsSignUpActive(true);
                                setError('');
                                setSuccess('');
                            }}>
                                Sign Up
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;