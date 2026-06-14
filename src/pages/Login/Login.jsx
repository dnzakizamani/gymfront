import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import GoogleLoginButton from '../../components/features/GoogleLoginButton';
import useAuthStore from '../../store/authStore';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        // Connect to backend API
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Invalid email or password');
            }

            // After successful login, set auth state and redirect
            localStorage.setItem('token', data.data.token);
            login(data.data.user);
            navigate('/dashboard');
        } catch (error) {
            setErrors({ general: error.message || 'Invalid email or password' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <h1 className="auth-title">Sign In</h1>

            {errors.general && (
                <div className="auth-error">{errors.general}</div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    error={errors.email}
                    fullWidth
                />

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    error={errors.password}
                    fullWidth
                />

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>

            <div className="divider">
                <span>or</span>
            </div>

            <GoogleLoginButton />

            <div className="auth-footer">
                Don't have an account? <Link to="/register">Create one</Link>
            </div>
        </AuthLayout>
    );
};

export default Login;
