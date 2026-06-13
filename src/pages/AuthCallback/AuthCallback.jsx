import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import './AuthCallback.css';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login, setUser } = useAuthStore();
    const [status, setStatus] = useState('processing');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
            setStatus('error');
            setTimeout(() => {
                navigate('/login?error=' + error);
            }, 2000);
            return;
        }

        if (token) {
            // Animate progress
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 100);

            // 1. Simpan token ke localStorage
            localStorage.setItem('token', token);

            // 2. Fetch user profile untuk verify token
            fetch('http://localhost:3000/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    clearInterval(progressInterval);
                    setProgress(100);

                    if (data.success) {
                        setUser(data.data);
                        login(data.data);
                        setStatus('success');

                        setTimeout(() => {
                            navigate('/dashboard');
                        }, 800);
                    } else {
                        throw new Error('Invalid token');
                    }
                })
                .catch(err => {
                    clearInterval(progressInterval);
                    console.error('Auth verification failed:', err);
                    localStorage.removeItem('token');
                    setStatus('error');
                    setTimeout(() => {
                        navigate('/login?error=auth_verification_failed');
                    }, 2000);
                });
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate, login, setUser]);

    return (
        <div className="auth-callback-container">
            <div className="auth-callback-card">
                <div className="logo-container">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6.5 6.5L17.5 17.5M6.5 17.5L17.5 6.5" strokeLinecap="round" />
                            <circle cx="12" cy="12" r="9" />
                        </svg>
                    </div>
                </div>

                <h1 className="auth-callback-title">Tilars</h1>
                <p className="auth-callback-subtitle">Welcome back!</p>

                <div className="progress-container">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="progress-text">{progress}%</span>
                </div>

                {status === 'processing' && (
                    <p className="auth-callback-message">Verifying your account...</p>
                )}

                {status === 'success' && (
                    <div className="auth-callback-success">
                        <div className="success-checkmark">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <p className="auth-callback-message">Success! Redirecting to dashboard...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="auth-callback-error">
                        <div className="error-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                            </svg>
                        </div>
                        <p className="auth-callback-message">Authentication failed. Please try again.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthCallback;
