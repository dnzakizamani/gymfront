import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import BottomNav from '../../components/layout/BottomNav';
import './Log.css';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Log = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [workoutDays, setWorkoutDays] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWorkoutDays = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/workouts/calendar?year=${year}&month=${month}`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    setWorkoutDays(data.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch workout days:', error);
            }
        };

        fetchWorkoutDays();
    }, [currentDate, navigate]);

    useEffect(() => {
        const fetchWorkoutsByDate = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            setIsLoading(true);
            try {
                // Use local date to avoid timezone issues
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const day = String(selectedDate.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/workouts/by-date?date=${dateStr}`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    setWorkouts(data.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch workouts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkoutsByDate();
    }, [selectedDate]);

    const getMonthData = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty slots for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push({ day: null, isEmpty: true });
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasWorkout = workoutDays.includes(day);
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();

            days.push({
                day,
                date,
                dateStr,
                hasWorkout,
                isSelected,
                isToday
            });
        }

        return days;
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDayClick = (dayData) => {
        if (dayData.isEmpty) return;
        setSelectedDate(dayData.date);
    };

    const formatSelectedDate = () => {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return selectedDate.toLocaleDateString('en-US', options);
    };

    const formatMonthYear = () => {
        const options = { month: 'long', year: 'numeric' };
        return currentDate.toLocaleDateString('en-US', options);
    };

    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}min ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const handleWorkoutClick = (workout) => {
        navigate(`/exercises/${workout.userExerciseId}`);
    };

    const handleAddWorkout = () => {
        navigate('/dashboard');
    };

    const monthData = getMonthData();

    return (
        <AppLayout>
            <div className="log-page">
                {/* Header */}
                {/* <div className="log-page-header">
                    <h1 className="log-page-title">Log Workout</h1>
                    <p className="log-page-subtitle">{formatMonthYear()}</p>
                </div> */}
                <div className="dashboard-header">
                    <div className="dashboard-header-left">
                        <h1 className="dashboard-title">Log Workout</h1>
                    </div>
                    <div className="dashboard-header-right">
                        <p className="log-page-subtitle">{formatMonthYear()}</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="log-page-main">
                    {/* Calendar Card */}
                    <div className="calendar-card">
                        <div className="calendar-nav">
                            <button className="calendar-nav-btn" onClick={handlePrevMonth}>
                                <i className="ri-arrow-left-s-line"></i>
                            </button>
                            <span className="calendar-month">{formatMonthYear()}</span>
                            <button className="calendar-nav-btn" onClick={handleNextMonth}>
                                <i className="ri-arrow-right-s-line"></i>
                            </button>
                        </div>

                        <div className="calendar-header">
                            {DAYS_OF_WEEK.map((day) => (
                                <div key={day} className="calendar-header-day">{day}</div>
                            ))}
                        </div>

                        <div className="calendar-grid">
                            {monthData.map((dayData, index) => (
                                <div key={index} className="calendar-cell">
                                    {dayData.isEmpty ? (
                                        <div className="calendar-day calendar-day--empty"></div>
                                    ) : (
                                        <button
                                            className={`calendar-day ${dayData.hasWorkout ? 'has-workout' : ''} ${dayData.isSelected ? 'selected' : ''} ${dayData.isToday ? 'today' : ''}`}
                                            onClick={() => handleDayClick(dayData)}
                                            disabled={dayData.isEmpty}
                                        >
                                            {dayData.day}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Workout List */}
                    <div className="workout-list">
                        <h2 className="workout-list-title">{formatSelectedDate()}</h2>

                        {isLoading ? (
                            <div className="workout-list-loading">Loading...</div>
                        ) : workouts.length > 0 ? (
                            <div className="workout-list-content">
                                {workouts.map((workout) => (
                                    <div
                                        key={workout.id}
                                        className="workout-card"
                                        onClick={() => handleWorkoutClick(workout)}
                                    >
                                        <div className="workout-card-header">
                                            <h3 className="workout-card-name">{workout.exerciseName}</h3>
                                            <span className="workout-card-time">
                                                {getRelativeTime(workout.createdAt)}
                                            </span>
                                        </div>

                                        <div className="workout-card-badges">
                                            <span className="badge badge-equipment">{workout.equipment}</span>
                                            <span className="badge badge-primary">{workout.primaryMuscle}</span>
                                        </div>

                                        <div className="workout-card-sets">
                                            {workout.sets.slice(0, 3).map((set, index) => (
                                                <span key={set.id} className="workout-set">
                                                    Set {set.setNumber}: {set.weight}kg × {set.reps}
                                                </span>
                                            ))}
                                            {workout.sets.length > 3 && (
                                                <span className="workout-set workout-set--more">
                                                    +{workout.sets.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="workout-list-empty">
                                <p className="workout-empty-text">No workouts logged for this date</p>
                                <button className="workout-empty-btn" onClick={handleAddWorkout}>
                                    + Add workout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <BottomNav />
            </div>
        </AppLayout>
    );
};

export default Log;
