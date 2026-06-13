import { useNavigate } from 'react-router-dom';
import ExerciseImage from '../../common/ExerciseImage';
import './ExerciseCard.css';

const ExerciseCard = ({ exercise }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/exercises/${exercise.id}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No sessions';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const formatWeight = (weight) => {
        if (!weight) return '-';
        return `${weight} kg`;
    };

    return (
        <div className="exercise-card" onClick={handleClick}>
            <div className="exercise-card-image">
                <ExerciseImage
                    imageUrl={exercise.imageUrl}
                    name={exercise.name}
                    primaryMuscle={exercise.primaryMuscle}
                    size="md"
                />
            </div>

            <div className="exercise-card-content">
                <h3 className="exercise-card-name">{exercise.name}</h3>
                <p className="exercise-card-equipment">{exercise.equipment}</p>
                <div className="exercise-card-badges">
                    <span className="exercise-card-badge exercise-card-badge--primary">
                        {exercise.primaryMuscle}
                    </span>
                    {exercise.secondaryMuscle && (
                        <span className="exercise-card-badge">
                            {exercise.secondaryMuscle}
                        </span>
                    )}
                </div>
            </div>

            <div className="exercise-card-meta">
                <div className="exercise-card-stat">
                    <span className="exercise-card-stat-label">Last</span>
                    <span className="exercise-card-stat-value">
                        {formatDate(exercise.lastSession)}
                    </span>
                </div>
                <div className="exercise-card-stat">
                    <span className="exercise-card-stat-label">PR</span>
                    <span className="exercise-card-stat-value">
                        {formatWeight(exercise.personalRecord)}
                    </span>
                </div>
            </div>

            <span className="exercise-card-chevron">›</span>
        </div>
    );
};

export default ExerciseCard;
