import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/common/Button';
import './LogWorkout.css';



const LogWorkout = () => {
    const { id, workoutId } = useParams();
    const navigate = useNavigate();
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [sets, setSets] = useState([
        { weight: '', reps: '' },
        { weight: '', reps: '' },
        { weight: '', reps: '' },
    ]);
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchExercise = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/user-exercises', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                
                if (response.ok) {
                    const userExercise = data.data.find(ue => ue.id === id);
                    if (userExercise) {
                        setExercise({
                            id: userExercise.id,
                            name: userExercise.customName || userExercise.exercise.name,
                            equipment: userExercise.exercise.equipment?.name || ''
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch exercise:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchWorkout = async () => {
            if (!workoutId) return;
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch(`http://localhost:3000/api/workouts/${workoutId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                
                if (response.ok && data.data) {
                    const w = data.data;
                    setDate(w.workoutDate || new Date().toISOString().split('T')[0]);
                    setNotes(w.notes || '');
                    if (w.sets && w.sets.length > 0) {
                        // Sort by setNumber to ensure order
                        const sortedSets = [...w.sets].sort((a, b) => a.setNumber - b.setNumber);
                        setSets(sortedSets.map(s => ({
                            id: s.id,
                            weight: s.weight.toString(),
                            reps: s.reps.toString()
                        })));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch workout:', error);
            }
        };

        fetchExercise();
        fetchWorkout();
    }, [id, workoutId, navigate]);

    const handleBack = () => {
        navigate(`/exercises/${id}`);
    };

    const handleAddSet = () => {
        setSets([...sets, { weight: '', reps: '' }]);
    };

    const handleRemoveSet = (index) => {
        if (sets.length > 1) {
            setSets(sets.filter((_, i) => i !== index));
        }
    };

    const handleSetChange = (index, field, value) => {
        const newSets = [...sets];
        newSets[index] = { ...newSets[index], [field]: value };
        setSets(newSets);

        // Clear error for this field
        const errorKey = `${index}-${field}`;
        if (errors[errorKey]) {
            setErrors({ ...errors, [errorKey]: null });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        sets.forEach((set, index) => {
            if (!set.weight || parseFloat(set.weight) <= 0) {
                newErrors[`${index}-weight`] = 'Required';
            }
            if (!set.reps || parseInt(set.reps) <= 0) {
                newErrors[`${index}-reps`] = 'Required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Prepare workout data
        const workoutData = {
            userExerciseId: id,
            workoutDate: date,
            sets: sets.map((set, index) => ({
                setNumber: index + 1,
                weight: parseFloat(set.weight),
                reps: parseInt(set.reps),
                notes: null,
            })),
            notes: notes || null,
        };

        try {
            const url = workoutId 
                ? `http://localhost:3000/api/workouts/${workoutId}` 
                : 'http://localhost:3000/api/workouts';
            
            const response = await fetch(url, {
                method: workoutId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(workoutData),
            });

            if (response.ok) {
                // Navigate back to exercise detail
                navigate(`/exercises/${id}`);
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to save workout');
            }
        } catch (error) {
            console.error('Failed to save workout:', error);
            alert('Failed to save workout');
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="log-workout">
                    <div className="log-workout-header">
                        <button className="log-workout-back" onClick={handleBack}>
                            ‹
                        </button>
                        <h1 className="log-workout-title">Loading...</h1>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!exercise) {
        return (
            <AppLayout>
                <div className="log-workout">
                    <div className="log-workout-header">
                        <button className="log-workout-back" onClick={handleBack}>
                            ‹
                        </button>
                        <h1 className="log-workout-title">Exercise not found</h1>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="log-workout">
                <div className="log-workout-header">
                    <button
                        className="log-workout-back"
                        onClick={handleBack}
                        aria-label="Go back"
                    >
                        ‹
                    </button>
                    <h1 className="log-workout-title">{workoutId ? 'Edit Workout' : 'Log Workout'}</h1>
                </div>

                <div className="log-workout-content">
                    {/* Exercise Info */}
                    <div className="log-workout-exercise-info">
                        <div className="log-workout-exercise-image">💪</div>
                        <div>
                            <h2 className="log-workout-exercise-name">{exercise.name}</h2>
                            <p className="log-workout-exercise-equipment">
                                {exercise.equipment}
                            </p>
                        </div>
                    </div>

                    {/* Date Picker */}
                    <div className="log-workout-date-section">
                        <label className="log-workout-date-label" htmlFor="workout-date">
                            Date
                        </label>
                        <input
                            type="date"
                            id="workout-date"
                            className="log-workout-set-input"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* Sets Section */}
                    <div className="log-workout-sets-section">
                        <div className="log-workout-sets-header">
                            <h3 className="log-workout-sets-title">Sets</h3>
                        </div>

                        <div className="log-workout-set-list">
                            {sets.map((set, index) => (
                                <div key={index} className="log-workout-set-card">
                                    <div className="log-workout-set-header">
                                        <span className="log-workout-set-number">
                                            Set {index + 1}
                                        </span>
                                        {sets.length > 1 && (
                                            <button
                                                className="log-workout-set-delete"
                                                onClick={() => handleRemoveSet(index)}
                                                aria-label={`Delete set ${index + 1}`}
                                            >
                                                🗑
                                            </button>
                                        )}
                                    </div>

                                    <div className="log-workout-set-inputs">
                                        <div className="log-workout-set-input-group">
                                            <label
                                                className="log-workout-set-input-label"
                                                htmlFor={`weight-${index}`}
                                            >
                                                Weight (kg)
                                            </label>
                                            <input
                                                type="number"
                                                id={`weight-${index}`}
                                                className="log-workout-set-input"
                                                placeholder="0"
                                                value={set.weight}
                                                onChange={(e) =>
                                                    handleSetChange(index, 'weight', e.target.value)
                                                }
                                                min="0"
                                                step="0.5"
                                            />
                                        </div>

                                        <div className="log-workout-set-input-group">
                                            <label
                                                className="log-workout-set-input-label"
                                                htmlFor={`reps-${index}`}
                                            >
                                                Reps
                                            </label>
                                            <input
                                                type="number"
                                                id={`reps-${index}`}
                                                className="log-workout-set-input"
                                                placeholder="0"
                                                value={set.reps}
                                                onChange={(e) =>
                                                    handleSetChange(index, 'reps', e.target.value)
                                                }
                                                min="0"
                                                step="1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="log-workout-add-set" onClick={handleAddSet}>
                            + Add Set
                        </button>
                    </div>

                    {/* Notes Section */}
                    <div className="log-workout-notes-section">
                        <label
                            className="log-workout-notes-label"
                            htmlFor="workout-notes"
                        >
                            Notes (optional)
                        </label>
                        <textarea
                            id="workout-notes"
                            className="log-workout-notes-input"
                            placeholder="How did it feel? Any observations..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            maxLength={500}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="log-workout-actions">
                        <Button variant="secondary" onClick={handleBack}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            {workoutId ? 'Update' : 'Save'}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default LogWorkout;
