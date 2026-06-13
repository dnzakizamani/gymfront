import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button';
import useAuthStore from '../../../store/authStore';
import './AppLayout.css';

const AppLayout = ({ children }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app-layout">
            <nav className="app-navbar">
                <div className="navbar-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                    <span className="navbar-logo-text" style={{ fontSize: '20px', color: '#FF6B35', letterSpacing: '1px' }}>TILARS</span>
                </div>
                <div className="navbar-actions">
                    {user && (
                        <Button variant="secondary" size="sm" onClick={handleLogout}>
                            Logout
                        </Button>
                    )}
                </div>
            </nav>
            <main className="app-main">{children}</main>
        </div>
    );
};

export default AppLayout;
