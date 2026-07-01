import { useState } from 'react';
import './ExerciseLibraryGridCard.css';

const ExerciseLibraryGridCard = ({ exercise, onToggle, isSelected, isDisabled, onAdd }) => {
    const [showModal, setShowModal] = useState(false);

    const handleCardClick = (e) => {
        if (e.target.closest('.exercise-grid-card-info')) return;
        if (isDisabled) return;
        if (onToggle) {
            onToggle(exercise);
        } else if (onAdd) {
            onAdd(exercise);
        }
    };

    const handleInfoClick = (e) => {
        e.stopPropagation();
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <div 
                className={`exercise-grid-card ${isSelected ? 'exercise-grid-card--selected' : ''} ${isDisabled ? 'exercise-grid-card--disabled' : ''}`} 
                onClick={handleCardClick}
            >
                {/* Selection Checkbox Indicator */}
                {isSelected && <div className="exercise-grid-card-check">✓</div>}
                
                {/* Owned Badge */}
                {isDisabled && <div className="exercise-grid-card-owned">Already Added</div>}

                {/* Info Button */}
                <button 
                    className="exercise-grid-card-info"
                    onClick={handleInfoClick}
                    aria-label="View exercise details"
                >
                    i
                </button>

                {/* Image Section */}
                <div className="exercise-grid-card-image">
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
                    <h3 className="exercise-grid-card-name">{exercise.name}</h3>
                    <span className="exercise-grid-card-equipment">{exercise.equipment}</span>

                    <div className="exercise-grid-card-muscles">
                        <span className="badge badge-primary">{exercise.primaryMuscle}</span>
                        {exercise.secondaryMuscle && (
                            <span className="badge badge-secondary">{exercise.secondaryMuscle}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="exercise-grid-card-modal" onClick={closeModal}>
                    <div className="exercise-grid-card-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="exercise-grid-card-modal-close" onClick={closeModal}>×</button>
                        {exercise.imageUrl ? (
                            <img src={exercise.imageUrl} alt={exercise.name} />
                        ) : (
                            <div className="exercise-grid-card-modal-placeholder">💪</div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ExerciseLibraryGridCard;
