import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bottom-nav">
            <button 
                className={`bottom-nav-item ${isActive('/dashboard') ? 'active' : ''}`}
                onClick={() => navigate('/dashboard')}
            >
                <i className="ri-home-line"></i>
                <span>Home</span>
            </button>
            <button 
                className={`bottom-nav-item ${isActive('/log') ? 'active' : ''}`}
                onClick={() => navigate('/log')}
            >
                <i className="ri-calendar-line"></i>
                <span>Log</span>
            </button>
            <button 
                className={`bottom-nav-item ${isActive('/analytics') ? 'active' : ''}`}
                onClick={() => navigate('/analytics')}
            >
                <i className="ri-bar-chart-line"></i>
                <span>Analytics</span>
            </button>
        </nav>
    );
};

export default BottomNav;
