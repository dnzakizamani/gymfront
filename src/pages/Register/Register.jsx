import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation (optional but if provided, not empty)
        if (formData.name && formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.name || formData.email.split('@')[0]
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Redirect to login on successful registration
            navigate('/login');
        } catch (error) {
            setErrors({ general: error.message || 'Registration failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <h1 className="auth-title">Create Account</h1>

            {errors.general && (
                <div className="auth-error">{errors.general}</div>
            )}

            <form className="register-form" onSubmit={handleSubmit}>
                <Input
                    label="Full Name (optional)"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    error={errors.name}
                    fullWidth
                />

                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    error={errors.email}
                    fullWidth
                />

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    error={errors.password}
                    fullWidth
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    error={errors.confirmPassword}
                    fullWidth
                />

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
            </form>

            <div className="auth-footer">
                Already have an account? <Link to="/login">Sign in</Link>
            </div>
        </AuthLayout>
    );
};

export default Register;
