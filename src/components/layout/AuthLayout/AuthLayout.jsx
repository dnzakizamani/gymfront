import { useNavigate } from 'react-router-dom';
import './AuthLayout.css';

const AuthLayout = ({ children }) => {
    const navigate = useNavigate();
    return (
        <div className="auth-layout">
            <div className="auth-card">
                <div className="auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <span className="auth-logo-text">TILARS</span>
                </div>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
