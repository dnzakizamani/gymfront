import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/common/Button';
import ExerciseCard from '../../components/features/ExerciseCard';
import ExerciseLibraryGridCard from '../../components/features/ExerciseLibraryCard/ExerciseLibraryGridCard';
import FilterButtons from '../../components/features/FilterButtons';
import EmptyState from '../../components/common/EmptyState';
import './Dashboard.css';



const Dashboard = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [userExercises, setUserExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserExercises = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user-exercises?includeStats=true`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    const formatted = data.data.map(ue => ({
                        id: ue.id,
                        name: ue.customName || ue.exercise.name,
                        equipment: ue.exercise.equipment?.name || '',
                        primaryMuscle: ue.exercise.muscles?.find(m => m.isPrimary)?.name || '',
                        secondaryMuscle: ue.exercise.muscles?.find(m => !m.isPrimary)?.name || '',
                        lastSession: ue.stats?.lastSession || null,
                        personalRecord: ue.stats?.personalRecord || null,
                        imageUrl: ue.exercise.imageUrl || null
                    }));
                    setUserExercises(formatted);
                }
            } catch (error) {
                console.error('Failed to fetch user exercises:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserExercises();
    }, [navigate]);

    const filteredExercises = useMemo(() => {
        if (activeFilter === 'All') {
            return userExercises;
        }
        return userExercises.filter(
            (exercise) =>
                exercise.primaryMuscle === activeFilter ||
                exercise.secondaryMuscle === activeFilter
        );
    }, [activeFilter, userExercises]);

    const handleAddExercise = () => {
        navigate('/exercises/add');
    };

    const handleExerciseClick = (exercise) => {
        navigate(`/exercises/${exercise.id}`);
    };

    const totalSessions = userExercises.filter((e) => e.lastSession).length;
    const totalPRs = userExercises.filter((e) => e.personalRecord).length;

    return (
        <AppLayout>
            <div className="dashboard">
                <div className="dashboard-header">
                    <div className="dashboard-header-left">
                        <h1 className="dashboard-title">My Exercises</h1>
                    </div>
                    <div className="dashboard-header-right">
                        <div className="dashboard-view-toggle">
                            <button
                                className={`dashboard-view-btn ${viewMode === 'list' ? 'dashboard-view-btn--active' : ''}`}
                                onClick={() => setViewMode('list')}
                                aria-label="List view"
                            >
                                ☰
                            </button>
                            <button
                                className={`dashboard-view-btn ${viewMode === 'grid' ? 'dashboard-view-btn--active' : ''}`}
                                onClick={() => setViewMode('grid')}
                                aria-label="Grid view"
                            >
                                ⊞
                            </button>
                        </div>
                        <Button variant="primary" size="sm" onClick={handleAddExercise}>
                            + Add
                        </Button>
                    </div>
                </div>

                <div className="dashboard-stats">
                    <div className="dashboard-stat-card">
                        <span className="dashboard-stat-value">
                            {userExercises.length}
                        </span>
                        <span className="dashboard-stat-label">Exercises</span>
                    </div>
                    <div className="dashboard-stat-card">
                        <span className="dashboard-stat-value">{totalSessions}</span>
                        <span className="dashboard-stat-label">Active</span>
                    </div>
                    <div className="dashboard-stat-card">
                        <span className="dashboard-stat-value">{totalPRs}</span>
                        <span className="dashboard-stat-label">PRs</span>
                    </div>
                </div>

                <FilterButtons
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />

                {filteredExercises.length > 0 ? (
                    viewMode === 'list' ? (
                        <div className="dashboard-content">
                            {filteredExercises.map((exercise) => (
                                <ExerciseCard
                                    key={exercise.id}
                                    exercise={exercise}
                                    onClick={() => handleExerciseClick(exercise)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="dashboard-grid">
                            {filteredExercises.map((exercise) => (
                                <ExerciseLibraryGridCard
                                    key={exercise.id}
                                    exercise={exercise}
                                    onAdd={() => handleExerciseClick(exercise)}
                                    isAdded={false}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <EmptyState
                        icon="💪"
                        title="No exercises found"
                        message="Try a different filter or add a new exercise to get started."
                        actionLabel="Add Exercise"
                        onAction={handleAddExercise}
                    />
                )}
            </div>
        </AppLayout>
    );
};

export default Dashboard;
