import Button from '../../common/Button';
import ExerciseImage from '../../common/ExerciseImage';
import './ExerciseLibraryCard.css';

const ExerciseLibraryCard = ({ exercise, onAdd, isAdded }) => {
    return (
        <div className="exercise-library-card">
            <div className="exercise-library-card-image">
                <ExerciseImage
                    imageUrl={exercise.imageUrl}
                    name={exercise.name}
                    primaryMuscle={exercise.primaryMuscle}
                    size="md"
                />
            </div>

            <div className="exercise-library-card-content">
                <h3 className="exercise-library-card-name">{exercise.name}</h3>
                <p className="exercise-library-card-equipment">{exercise.equipment}</p>
                <div className="exercise-library-card-badges">
                    <span className="exercise-library-card-badge exercise-library-card-badge--primary">
                        {exercise.primaryMuscle}
                    </span>
                    {exercise.secondaryMuscle && (
                        <span className="exercise-library-card-badge">
                            {exercise.secondaryMuscle}
                        </span>
                    )}
                </div>
            </div>

            <div className="exercise-library-card-add">
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onAdd(exercise)}
                    disabled={isAdded}
                >
                    {isAdded ? '✓ Added' : '+ Add'}
                </Button>
            </div>
        </div>
    );
};

export default ExerciseLibraryCard;
