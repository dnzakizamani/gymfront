import { getExerciseImageUrl } from '../../../lib/supabase';
import './ExerciseImage.css';

const EXERCISE_EMOJIS = {
    default: '💪',
    chest: '🏋️',
    back: '🏋️',
    legs: '🦵',
    shoulders: '💪',
    arms: '💪',
    core: '🤸',
    cardio: '🏃',
};

const getEmojiForExercise = (name, primaryMuscle) => {
    const searchText = `${name} ${primaryMuscle}`.toLowerCase();

    if (searchText.includes('bench') || searchText.includes('chest')) return '🏋️';
    if (searchText.includes('squat') || searchText.includes('leg')) return '🦵';
    if (searchText.includes('deadlift') || searchText.includes('back')) return '🏋️';
    if (searchText.includes('curl') || searchText.includes('bicep') || searchText.includes('tricep')) return '💪';
    if (searchText.includes('shoulder')) return '🎯';
    if (searchText.includes('plank') || searchText.includes('crunch') || searchText.includes('abs')) return '🤸';
    if (searchText.includes('run') || searchText.includes('cardio') || searchText.includes('treadmill')) return '🏃';
    if (searchText.includes('pull')) return '🤲';
    if (searchText.includes('push')) return '💪';

    return '💪';
};

/**
 * Exercise Image Component
 * Shows image if available, falls back to emoji
 */
const ExerciseImage = ({
    imageUrl,
    name = '',
    primaryMuscle = '',
    className = '',
    size = 'md',
    alt = ''
}) => {
    const fullUrl = getExerciseImageUrl(imageUrl);
    const emoji = getEmojiForExercise(name, primaryMuscle);
    const imageAlt = alt || name || 'Exercise';

    if (fullUrl) {
        return (
            <div className={`exercise-image exercise-image--${size} ${className}`}>
                <img
                    src={fullUrl}
                    alt={imageAlt}
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
                <div className="exercise-image-fallback" style={{ display: 'none' }}>
                    <span className="exercise-image-emoji">{emoji}</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`exercise-image exercise-image--${size} exercise-image--placeholder ${className}`}>
            <span className="exercise-image-emoji">{emoji}</span>
        </div>
    );
};

export default ExerciseImage;
