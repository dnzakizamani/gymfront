import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Input from '../../components/common/Input';
import FilterButtons from '../../components/features/FilterButtons';
import ExerciseLibraryGridCard from '../../components/features/ExerciseLibraryCard/ExerciseLibraryGridCard';
import EmptyState from '../../components/common/EmptyState';
import './ExerciseLibrary.css';


const ExerciseLibrary = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [masterExercises, setMasterExercises] = useState([]);
    const [userExerciseIds, setUserExerciseIds] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/exercises?limit=100`);
                const data = await response.json();
                if (response.ok) {
                    setMasterExercises(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch exercises:', error);
            }
        };

        const fetchUserExercises = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user-exercises`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setUserExerciseIds(data.data.map(ue => ue.exercise.id));
                }
            } catch (error) {
                console.error('Failed to fetch user exercises:', error);
            }
        };

        fetchExercises();
        fetchUserExercises();
    }, []);

    const filteredExercises = useMemo(() => {
        let result = masterExercises
            .map(ex => {
                const primaryMuscle = ex.muscles?.find(m => m.isPrimary)?.name || '';
                const secondaryMuscle = ex.muscles?.find(m => !m.isPrimary)?.name || '';
                return {
                    ...ex,
                    primaryMuscle,
                    secondaryMuscle,
                    equipment: ex.equipment?.name || '',
                    isOwned: userExerciseIds.includes(ex.id)
                };
            });

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (exercise) =>
                    exercise.name.toLowerCase().includes(query) ||
                    exercise.equipment.toLowerCase().includes(query) ||
                    exercise.primaryMuscle.toLowerCase().includes(query)
            );
        }

        if (activeFilter !== 'All') {
            result = result.filter(
                (exercise) =>
                    exercise.primaryMuscle === activeFilter ||
                    exercise.secondaryMuscle === activeFilter ||
                    (exercise.muscles && exercise.muscles.some(m => m.name === activeFilter))
            );
        }

        return result;
    }, [searchQuery, activeFilter, masterExercises, userExerciseIds]);

    const handleToggleExercise = (exercise) => {
        setSelectedExercises(prev => {
            const isSelected = prev.some(e => e.id === exercise.id);
            if (isSelected) {
                return prev.filter(e => e.id !== exercise.id);
            } else {
                return [...prev, exercise];
            }
        });
    };

    const handleRemoveExercise = (exerciseId) => {
        setSelectedExercises(prev => prev.filter(e => e.id !== exerciseId));
    };

    const handleSave = async () => {
        if (selectedExercises.length === 0) return;

        setIsSaving(true);
        const token = localStorage.getItem('token');

        try {
            for (const exercise of selectedExercises) {
                await fetch(`${process.env.REACT_APP_API_URL}/api/user-exercises`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ exerciseId: exercise.id })
                });
            }
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to save exercises:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    return (
        <AppLayout>
            <div className="exercise-library">
                <div className="exercise-library-header">
                    <div className="exercise-library-header-left">
                    <button
                        className="exercise-library-back"
                        onClick={handleBack}
                        aria-label="Go back"
                    >
                        <i className="ri-arrow-left-line"></i>
                    </button>
                        <h1 className="exercise-library-title">Add Exercise</h1>
                    </div>
                </div>

                <div className="exercise-library-search">
                    <Input
                        type="text"
                        placeholder="Search exercises..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        fullWidth
                    />
                </div>

                <FilterButtons
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />

                <div className="exercise-library-grid">
                    {filteredExercises.length > 0 ? (
                        <>
                            {/* Available Exercises */}
                            {filteredExercises.filter(ex => !ex.isOwned).length > 0 && (
                                <>
                                    <div className="exercise-library-section-title">Available Exercises</div>
                                    {filteredExercises.filter(ex => !ex.isOwned).map((exercise) => (
                                        <ExerciseLibraryGridCard
                                            key={exercise.id}
                                            exercise={exercise}
                                            onToggle={handleToggleExercise}
                                            isSelected={selectedExercises.some(e => e.id === exercise.id)}
                                        />
                                    ))}
                                </>
                            )}

                            {/* Already Added Exercises */}
                            {filteredExercises.filter(ex => ex.isOwned).length > 0 && (
                                <>
                                    <div className="exercise-library-section-divider">
                                        <span>Already Added</span>
                                    </div>
                                    {filteredExercises.filter(ex => ex.isOwned).map((exercise) => (
                                        <ExerciseLibraryGridCard
                                            key={exercise.id}
                                            exercise={exercise}
                                            isDisabled={true}
                                        />
                                    ))}
                                </>
                            )}
                        </>
                    ) : (
                        <EmptyState
                            icon="🔍"
                            title="No exercises found"
                            message="Try adjusting your search or filter to find exercises."
                        />
                    )}
                </div>

                {/* Floating Selection Summary */}
                {selectedExercises.length > 0 && (
                    <div className="exercise-library-selection-bar">
                        <div className="exercise-library-selection-summary">
                            <span className="exercise-library-selection-count">
                                {selectedExercises.length} exercise selected
                            </span>
                            <div className="exercise-library-selection-list">
                                {selectedExercises.map(exercise => (
                                    <span key={exercise.id} className="exercise-library-selection-tag">
                                        {exercise.name} - {exercise.equipment}
                                        <button
                                            onClick={() => handleRemoveExercise(exercise.id)}
                                            className="exercise-library-selection-remove"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button
                            className="exercise-library-save-btn"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : `${selectedExercises.length} Selected`}
                        </button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default ExerciseLibrary;
