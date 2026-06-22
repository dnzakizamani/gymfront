import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import './styles/globals.css';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ExerciseLibrary from './pages/ExerciseLibrary';
import ExerciseDetail from './pages/ExerciseDetail';
import LogWorkout from './pages/LogWorkout';
import Log from './pages/Log';
import Analytics from './pages/Analytics';
import AuthCallback from './pages/AuthCallback';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
    const { isAuthenticated, user, setUser, logout } = useAuthStore();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token && !user) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setUser(data.data);
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            }
        };

        fetchUser();
    }, [isAuthenticated, user, setUser, logout]);

    return (
        <Router>
            <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/exercises/add"
                element={
                    <ProtectedRoute>
                        <ExerciseLibrary />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/exercises/:id"
                element={
                    <ProtectedRoute>
                        <ExerciseDetail />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/exercises/:id/log"
                element={
                    <ProtectedRoute>
                        <LogWorkout />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/exercises/:id/log/:workoutId"
                element={
                    <ProtectedRoute>
                        <LogWorkout />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/log"
                element={
                    <ProtectedRoute>
                        <Log />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/analytics"
                element={
                    <ProtectedRoute>
                        <Analytics />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Router>
    );
}

export default App;
