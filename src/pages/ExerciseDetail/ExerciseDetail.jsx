import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/common/Button';
import ExerciseImage from '../../components/common/ExerciseImage';
import './ExerciseDetail.css';



const ExerciseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exercise, setExercise] = useState(null);
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchExerciseData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            setLoading(true);
            try {
                // Fetch exercise details
                const exerciseRes = await fetch(`${process.env.REACT_APP_API_URL}/api/user-exercises?includeStats=true`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const exerciseDataList = await exerciseRes.json();

                if (exerciseRes.ok) {
                    // Find the specific user exercise
                    const userExercise = exerciseDataList.data.find(ue => ue.id === id);
                    if (userExercise) {
                        setExercise({
                            id: userExercise.id,
                            name: userExercise.customName || userExercise.exercise.name,
                            equipment: userExercise.exercise.equipment?.name || '',
                            primaryMuscle: userExercise.exercise.muscles?.find(m => m.isPrimary)?.name || '',
                            secondaryMuscle: userExercise.exercise.muscles?.find(m => !m.isPrimary)?.name || '',
                            imageUrl: userExercise.exercise.imageUrl || null,
                            lastSession: userExercise.stats?.lastSession || null,
                            personalRecord: userExercise.stats?.personalRecord || null
                        });
                    }
                }

                // Fetch workout history
                const historyRes = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts?userExerciseId=${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const historyData = await historyRes.json();

                if (historyRes.ok) {
                    const formattedHistory = historyData.data.map(session => ({
                        id: session.id,
                        date: session.workoutDate,
                        sets: session.sets.map(s => ({ id: s.id, weight: s.weight, reps: s.reps }))
                    }));
                    setWorkoutHistory(formattedHistory);
                }
            } catch (error) {
                console.error('Failed to fetch exercise details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExerciseData();
    }, [id, navigate]);

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleLogWorkout = () => {
        navigate(`/exercises/${id}/log`);
    };

    const handleDelete = async () => {
        if (deleteConfirmText !== exercise.name) return;

        setIsDeleting(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user-exercises/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                navigate('/dashboard');
            } else {
                alert('Failed to delete exercise');
                setIsDeleting(false);
            }
        } catch (error) {
            console.error('Failed to delete exercise:', error);
            alert('Failed to delete exercise');
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const getChartData = () => {
        if (workoutHistory.length === 0) return [];
        // Get last 6 sessions for chart
        return workoutHistory.slice(0, 6).reverse().map((session) => {
            const maxWeight = Math.max(...session.sets.map((s) => s.weight));
            return {
                date: formatDate(session.date),
                weight: maxWeight,
            };
        });
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="exercise-detail">
                    <div className="exercise-detail-header">
                        <button className="exercise-detail-back" onClick={handleBack}>
                            ‹
                        </button>
                        <h1 className="exercise-detail-title">Loading...</h1>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!exercise) {
        return (
            <AppLayout>
                <div className="exercise-detail">
                    <div className="exercise-detail-header">
                        <button className="exercise-detail-back" onClick={handleBack}>
                            ‹
                        </button>
                        <h1 className="exercise-detail-title">Exercise not found</h1>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const chartData = getChartData();

    return (
        <AppLayout>
            <div className="exercise-detail">
                <div className="exercise-detail-header">
                    <button
                        className="exercise-detail-back"
                        onClick={handleBack}
                        aria-label="Go back"
                    >
                        ‹
                    </button>
                    <h1 className="exercise-detail-title">{exercise.name}</h1>
                </div>

                <div className="exercise-detail-content">
                    {/* Exercise Image - Full Width */}
                    <div className="exercise-detail-image-container">
                        <ExerciseImage
                            imageUrl={exercise.imageUrl}
                            name={exercise.name}
                            primaryMuscle={exercise.primaryMuscle}
                            size="xl"
                            className="exercise-detail-image"
                        />
                    </div>

                    {/* Exercise Info */}
                    <div className="exercise-detail-info">
                        <div className="exercise-detail-info-content">
                            <h2 className="exercise-detail-name">{exercise.name} - {exercise.equipment}</h2>
                            <div className="exercise-detail-muscles">
                                <span className="exercise-detail-muscle-badge">
                                    {exercise.primaryMuscle}
                                </span>
                                {exercise.secondaryMuscle && (
                                    <span className="exercise-detail-muscle-badge exercise-detail-muscle-badge--secondary">
                                        {exercise.secondaryMuscle}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="exercise-detail-stats">
                        <div className="exercise-detail-stat-card">
                            <span className="exercise-detail-stat-icon">🏆</span>
                            <span className="exercise-detail-stat-value">
                                {exercise.personalRecord || '-'}
                            </span>
                            <span className="exercise-detail-stat-label">Best (kg)</span>
                        </div>
                        <div className="exercise-detail-stat-card">
                            <span className="exercise-detail-stat-icon">📊</span>
                            <span className="exercise-detail-stat-value">
                                {workoutHistory.length}
                            </span>
                            <span className="exercise-detail-stat-label">Sessions</span>
                        </div>
                        <div className="exercise-detail-stat-card">
                            <span className="exercise-detail-stat-icon">📅</span>
                            <span className="exercise-detail-stat-value">
                                {exercise.lastSession
                                    ? formatDate(exercise.lastSession)
                                    : '-'}
                            </span>
                            <span className="exercise-detail-stat-label">Last Session</span>
                        </div>
                    </div>

                    {/* Progress Chart */}
                    {chartData.length > 0 && (() => {
                        const svgWidth = 1000;
                        const svgHeight = 300;

                        const paddingLeft = 80;
                        const paddingRight = 30;
                        const paddingTop = 30;
                        const paddingBottom = 50;

                        const chartWidth =
                            svgWidth - paddingLeft - paddingRight;

                        const chartHeight =
                            svgHeight - paddingTop - paddingBottom;

                        const minW = Math.min(
                            ...chartData.map(c => c.weight)
                        );

                        const maxW = Math.max(
                            ...chartData.map(c => c.weight)
                        );

                        const range = maxW - minW || 1;

                        const getPoint = (weight, index) => {
                            const x =
                                paddingLeft +
                                (index /
                                    Math.max(
                                        chartData.length - 1,
                                        1
                                    )) *
                                chartWidth;

                            const y =
                                paddingTop +
                                chartHeight -
                                ((weight - minW) / range) *
                                chartHeight;

                            return { x, y };
                        };

                        const linePoints = chartData
                            .map((d, i) => {
                                const { x, y } = getPoint(
                                    d.weight,
                                    i
                                );

                                return `${x},${y}`;
                            })
                            .join(' ');

                        const areaPoints = `
        ${paddingLeft},${svgHeight - paddingBottom}
        ${linePoints}
        ${svgWidth - paddingRight},${svgHeight - paddingBottom}
    `;

                        return (
                            <div className="exercise-detail-chart-section">
                                <h3 className="exercise-detail-chart-title">
                                    Weight Progress
                                </h3>

                                <svg
                                    width="100%"
                                    height="250"
                                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                                    preserveAspectRatio="none"
                                >
                                    <defs>
                                        <linearGradient
                                            id="chartGradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="var(--color-info)"
                                                stopOpacity="0.35"
                                            />

                                            <stop
                                                offset="100%"
                                                stopColor="var(--color-info)"
                                                stopOpacity="0"
                                            />
                                        </linearGradient>
                                    </defs>

                                    {/* GRID HORIZONTAL */}
                                    {Array.from({ length: 5 }).map(
                                        (_, i) => {
                                            const y =
                                                paddingTop +
                                                (i * chartHeight) / 4;

                                            return (
                                                <line
                                                    key={`h-${i}`}
                                                    x1={paddingLeft}
                                                    y1={y}
                                                    x2={
                                                        svgWidth -
                                                        paddingRight
                                                    }
                                                    y2={y}
                                                    stroke="rgba(255,255,255,0.08)"
                                                    strokeWidth="1"
                                                />
                                            );
                                        }
                                    )}

                                    {/* GRID VERTICAL */}
                                    {chartData.map((_, i) => {
                                        const { x } = getPoint(
                                            minW,
                                            i
                                        );

                                        return (
                                            <line
                                                key={`v-${i}`}
                                                x1={x}
                                                y1={paddingTop}
                                                x2={x}
                                                y2={
                                                    svgHeight -
                                                    paddingBottom
                                                }
                                                stroke="rgba(255,255,255,0.05)"
                                                strokeWidth="1"
                                            />
                                        );
                                    })}

                                    {/* Y AXIS */}
                                    <line
                                        x1={paddingLeft}
                                        y1={paddingTop}
                                        x2={paddingLeft}
                                        y2={
                                            svgHeight - paddingBottom
                                        }
                                        stroke="rgba(255,255,255,0.2)"
                                        strokeWidth="2"
                                    />

                                    {/* X AXIS */}
                                    <line
                                        x1={paddingLeft}
                                        y1={
                                            svgHeight - paddingBottom
                                        }
                                        x2={
                                            svgWidth - paddingRight
                                        }
                                        y2={
                                            svgHeight - paddingBottom
                                        }
                                        stroke="rgba(255,255,255,0.2)"
                                        strokeWidth="2"
                                    />

                                    {/* LABEL Y */}
                                    {Array.from({ length: 5 }).map(
                                        (_, i) => {
                                            const value =
                                                maxW -
                                                ((maxW - minW) *
                                                    i) /
                                                4;

                                            const y =
                                                paddingTop +
                                                (i * chartHeight) / 4;

                                            return (
                                                <text
                                                    key={`y-${i}`}
                                                    x={paddingLeft - 15}
                                                    y={y + 5}
                                                    textAnchor="end"
                                                    fontSize="20"
                                                    fill="rgba(255,255,255,0.6)"
                                                >
                                                    {value.toFixed(0)}
                                                </text>
                                            );
                                        }
                                    )}

                                    {/* AREA */}
                                    <polygon
                                        points={areaPoints}
                                        fill="url(#chartGradient)"
                                    />

                                    {/* LINE */}
                                    <polyline
                                        points={linePoints}
                                        fill="none"
                                        stroke="var(--color-info)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                    {/* POINTS + LABEL */}
                                    {chartData.map((d, i) => {
                                        const { x, y } = getPoint(
                                            d.weight,
                                            i
                                        );

                                        return (
                                            <g key={i}>
                                                <rect
                                                    x={x - 30}
                                                    y={y - 55}
                                                    width="60"
                                                    height="28"
                                                    rx="6"
                                                    fill="rgba(20,20,20,.95)"
                                                    stroke="var(--color-info)"
                                                />

                                                <text
                                                    x={x}
                                                    y={y - 36}
                                                    textAnchor="middle"
                                                    fontSize="18"
                                                    fill="white"
                                                >
                                                    {d.weight}
                                                </text>

                                                <circle
                                                    cx={x}
                                                    cy={y}
                                                    r="7"
                                                    fill="var(--color-background-primary)"
                                                    stroke="var(--color-info)"
                                                    strokeWidth="3"
                                                />
                                            </g>
                                        );
                                    })}

                                    {/* LABEL X */}
                                    {chartData.map((d, i) => {
                                        const { x } = getPoint(
                                            minW,
                                            i
                                        );

                                        return (
                                            <text
                                                key={`x-${i}`}
                                                x={x}
                                                y={
                                                    svgHeight -
                                                    paddingBottom +
                                                    25
                                                }
                                                textAnchor="middle"
                                                fontSize="18"
                                                fill="rgba(255,255,255,0.5)"
                                            >
                                                {i + 1}
                                            </text>
                                        );
                                    })}
                                </svg>
                            </div>
                        );
                    })()}

                    {/* Workout History */}
                    <div className="exercise-detail-history-section">
                        <h3 className="exercise-detail-history-title">Workout History</h3>
                        {workoutHistory.length > 0 ? (
                            <div className="exercise-detail-history-list">
                                {workoutHistory.map((session, index) => (
                                    <div key={index} className="exercise-detail-history-item">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span className="exercise-detail-history-date">
                                                {new Date(session.date).toLocaleDateString(
                                                    'en-US',
                                                    {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    }
                                                )}
                                            </span>
                                            <button
                                                style={{ background: 'none', border: 'none', color: 'var(--color-info)', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
                                                onClick={() => navigate(`/exercises/${id}/log/${session.id}`)}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        <div className="exercise-detail-history-sets">
                                            {session.sets.map((set, setIndex) => (
                                                <span
                                                    key={setIndex}
                                                    className="exercise-detail-history-set"
                                                >
                                                    <span className="exercise-detail-history-set-weight">
                                                        {set.weight}kg
                                                    </span>
                                                    × {set.reps}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                                No workout history yet. Log your first workout!
                            </p>
                        )}
                    </div>
                    {/* Delete Exercise Section */}
                    <div className="exercise-detail-delete-section">
                        <button
                            className="exercise-detail-delete-btn"
                            onClick={() => {
                                setDeleteConfirmText('');
                                setShowDeleteModal(true);
                            }}
                        >
                            Delete Exercise
                        </button>
                    </div>
                </div>

                {/* Log Workout Button */}
                <div className="exercise-detail-log-btn">
                    <Button variant="primary" onClick={handleLogWorkout}>
                        + Log Workout
                    </Button>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="exercise-detail-modal-overlay">
                        <div className="exercise-detail-modal">
                            <h3 className="exercise-detail-modal-title">Delete Exercise</h3>
                            <p className="exercise-detail-modal-message">
                                Are you sure you want to delete <strong>{exercise.name}</strong>?
                                <br /><br />
                                <strong>Warning:</strong> All workout history for this exercise will be permanently deleted.
                            </p>
                            <input
                                type="text"
                                className="exercise-detail-modal-input"
                                placeholder={`Type "${exercise.name}" to confirm`}
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                            />
                            <div className="exercise-detail-modal-actions">
                                <button
                                    className="exercise-detail-modal-cancel"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="exercise-detail-modal-confirm"
                                    onClick={handleDelete}
                                    disabled={deleteConfirmText !== exercise.name || isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout >
    );
};

export default ExerciseDetail;
