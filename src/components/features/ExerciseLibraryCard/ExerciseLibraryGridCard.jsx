import Button from '../../common/Button';
import './ExerciseLibraryGridCard.css';

const ExerciseLibraryGridCard = ({ exercise, onAdd, isAdded }) => {
    const handleClick = () => {
        if (!isAdded) {
            onAdd(exercise);
        }
    };

    // Color mapping untuk primary muscle
    const getMuscleColor = (muscle) => {
        const colors = {
            'Back': '#378ADD',
            'Chest': '#D85A30',
            'Legs': '#639922',
            'Shoulder': '#BA7517',
            'Biceps': '#534AB7',
            'Triceps': '#D4537E',
            'Forearms': '#9E6E1C',
            'Abs': '#5F5E5A',
            'Glutes': '#7B5A4D',
            'Quadriceps': '#639922',
            'Hamstrings': '#5A8E2B',
            'Calves': '#6B9A2F',
        };
        return colors[muscle] || '#378ADD';
    };

    const primaryMuscleColor = getMuscleColor(exercise.primaryMuscle);

    return (
        <div className="exercise-grid-card" onClick={handleClick}>
            {/* Image Section - Square (200px × 200px) */}
            <div
                className="exercise-grid-card-image"
                style={{
                    background: '#ffffff',
                }}
            >
                {exercise.imageUrl ? (
                    <img
                        src={exercise.imageUrl}
                        alt={exercise.name}
                        loading="lazy"
                    />
                ) : (
                    <span className="exercise-grid-card-placeholder">💪</span>
                )}
            </div>

            {/* Content Section */}
            <div className="exercise-grid-card-content">
                {/* Exercise Name */}
                <h3 className="exercise-grid-card-name">{exercise.name} - {exercise.equipment}</h3>

                {/* Equipment Badge */}
                {/* <span className="badge badge-equipment">{exercise.equipment}</span> */}

                {/* Muscle Badges (hanya primary + secondary) */}
                <div className="exercise-grid-card-muscles">
                    <span className="badge badge-primary">{exercise.primaryMuscle}</span>
                    {exercise.secondaryMuscle && (
                        <span className="badge badge-secondary">{exercise.secondaryMuscle}</span>
                    )}
                </div>

                {/* Footer: Last Session + Best PR */}
                {/* <div className="exercise-grid-card-footer">
                    <div className="footer-item">
                        <span className="footer-label">Last</span>
                        <span className="footer-value">
                            {exercise.lastSessionDate ? new Date(exercise.lastSessionDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }) : '—'}
                        </span>
                    </div>
                    <div className="footer-divider"></div>
                    <div className="footer-item">
                        <span className="footer-label">Best</span>
                        <span className="footer-value">
                            {exercise.bestWeight ? `${exercise.bestWeight}kg` : '—'}
                        </span>
                    </div>
                </div> */}

                {/* Add Button */}
                <div className="exercise-grid-card-action" onClick={(e) => e.stopPropagation()}>
                    <Button
                        variant={isAdded ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => onAdd(exercise)}
                        className="exercise-grid-card-button"
                    >
                        {isAdded ? '✓' : '+'}
                    </Button>
                </div>
            </div>

            {/* Added State Badge */}
            {isAdded && <div className="exercise-grid-card-added-badge">✓</div>}
        </div>
    );
};

export default ExerciseLibraryGridCard;
