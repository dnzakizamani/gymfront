import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Input from '../../components/common/Input';
import FilterButtons from '../../components/features/FilterButtons';
import ExerciseLibraryCard from '../../components/features/ExerciseLibraryCard';
import ExerciseLibraryGridCard from '../../components/features/ExerciseLibraryCard/ExerciseLibraryGridCard';
import EmptyState from '../../components/common/EmptyState';
import './ExerciseLibrary.css';



const ExerciseLibrary = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [addedExercises, setAddedExercises] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [masterExercises, setMasterExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
            } finally {
                setIsLoading(false);
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
                    setAddedExercises(data.data.map(ue => ue.exercise.id));
                }
            } catch (error) {
                console.error('Failed to fetch user exercises:', error);
            }
        };

        fetchExercises();
        fetchUserExercises();
    }, []);

    const filteredExercises = useMemo(() => {
        let result = masterExercises.map(ex => {
            const primaryMuscle = ex.muscles?.find(m => m.isPrimary)?.name || '';
            const secondaryMuscle = ex.muscles?.find(m => !m.isPrimary)?.name || '';
            return {
                ...ex,
                primaryMuscle,
                secondaryMuscle,
                equipment: ex.equipment?.name || ''
            };
        });

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (exercise) =>
                    exercise.name.toLowerCase().includes(query) ||
                    exercise.equipment.toLowerCase().includes(query) ||
                    exercise.primaryMuscle.toLowerCase().includes(query)
            );
        }

        // Filter by muscle group
        if (activeFilter !== 'All') {
            result = result.filter(
                (exercise) =>
                    exercise.primaryMuscle === activeFilter ||
                    exercise.secondaryMuscle === activeFilter ||
                    (exercise.muscles && exercise.muscles.some(m => m.name === activeFilter))
            );
        }

        return result;
    }, [searchQuery, activeFilter, masterExercises]);

    const handleAddExercise = async (exercise) => {
        if (!addedExercises.includes(exercise.id)) {
            // Optimistic update
            setAddedExercises([...addedExercises, exercise.id]);

            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user-exercises`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ exerciseId: exercise.id })
                    });
                    if (!response.ok) {
                        // Revert optimistic update on failure
                        setAddedExercises(addedExercises.filter(id => id !== exercise.id));
                    }
                } catch (error) {
                    console.error('Failed to add exercise:', error);
                    // Revert optimistic update on failure
                    setAddedExercises(addedExercises.filter(id => id !== exercise.id));
                }
            }
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
                            ‹
                        </button>
                        <h1 className="exercise-library-title">Add Exercise</h1>
                    </div>
                    <div className="exercise-library-header-right">
                        <div className="exercise-library-view-toggle">
                            <button
                                className={`exercise-library-view-btn ${viewMode === 'list' ? 'exercise-library-view-btn--active' : ''}`}
                                onClick={() => setViewMode('list')}
                                aria-label="List view"
                            >
                                ☰
                            </button>
                            <button
                                className={`exercise-library-view-btn ${viewMode === 'grid' ? 'exercise-library-view-btn--active' : ''}`}
                                onClick={() => setViewMode('grid')}
                                aria-label="Grid view"
                            >
                                ⊞
                            </button>
                        </div>
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

                {viewMode === 'list' ? (
                    <div className="exercise-library-content">
                        {filteredExercises.length > 0 ? (
                            filteredExercises.map((exercise) => (
                                <ExerciseLibraryCard
                                    key={exercise.id}
                                    exercise={exercise}
                                    onAdd={handleAddExercise}
                                    isAdded={addedExercises.includes(exercise.id)}
                                />
                            ))
                        ) : (
                            <EmptyState
                                icon="🔍"
                                title="No exercises found"
                                message="Try adjusting your search or filter to find exercises."
                            />
                        )}
                    </div>
                ) : (
                    <div className="exercise-library-grid">
                        {filteredExercises.length > 0 ? (
                            filteredExercises.map((exercise) => (
                                <ExerciseLibraryGridCard
                                    key={exercise.id}
                                    exercise={exercise}
                                    onAdd={handleAddExercise}
                                    isAdded={addedExercises.includes(exercise.id)}
                                />
                            ))
                        ) : (
                            <EmptyState
                                icon="🔍"
                                title="No exercises found"
                                message="Try adjusting your search or filter to find exercises."
                            />
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default ExerciseLibrary;
