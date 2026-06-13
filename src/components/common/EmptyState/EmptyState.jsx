import Button from '../Button';
import './EmptyState.css';

const EmptyState = ({ icon, title, message, actionLabel, onAction }) => {
    return (
        <div className="empty-state">
            {icon && <div className="empty-state-icon">{icon}</div>}
            <h3 className="empty-state-title">{title}</h3>
            {message && <p className="empty-state-message">{message}</p>}
            {actionLabel && onAction && (
                <Button variant="primary" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
