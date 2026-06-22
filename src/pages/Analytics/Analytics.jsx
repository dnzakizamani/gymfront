import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import BottomNav from '../../components/layout/BottomNav';
import './Analytics.css';

// Separate component for Volume Chart to avoid full page re-render
const VolumeChart = ({ activePeriod, onPeriodChange }) => {
    const [volumeData, setVolumeData] = useState({ labels: [], volumes: [] });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchVolumeData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/analytics/volume-chart?period=${activePeriod}&months=6`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setVolumeData({
                        labels: data.data.labels || [],
                        volumes: data.data.volumes || []
                    });
                }
            } catch (error) {
                console.error('Failed to fetch volume data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVolumeData();
    }, [activePeriod]);

    const formatVolume = (volume) => {
        if (volume >= 1000000) return (volume / 1000000).toFixed(1) + 'M';
        if (volume >= 1000) return (volume / 1000).toFixed(0) + 'K';
        return volume.toString();
    };

    const maxVolume = volumeData.volumes.length > 0 ? Math.max(...volumeData.volumes) : 1;

    return (
        <div className="analytics-chart">
            {isLoading ? (
                <div className="analytics-chart-loading">Loading...</div>
            ) : (
                volumeData.labels.map((label, index) => {
                    const volume = volumeData.volumes[index] || 0;
                    const height = maxVolume > 0 ? (volume / maxVolume) * 100 : 0;
                    return (
                        <div key={label} className="analytics-chart-bar">
                            <div 
                                className="analytics-chart-bar-fill" 
                                style={{ height: `${height}%` }}
                            >
                                <span className="analytics-chart-bar-value">{formatVolume(volume)}</span>
                            </div>
                            <span className="analytics-chart-bar-label">{label}</span>
                        </div>
                    );
                })
            )}
        </div>
    );
};

const Analytics = () => {
    const navigate = useNavigate();
    const [activeVolumePeriod, setActiveVolumePeriod] = useState('monthly');
    const [activeViewMode, setActiveViewMode] = useState('chart');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Data state
    const [overview, setOverview] = useState({ totalWorkouts: 0, totalVolume: 0 });
    const [personalRecords, setPersonalRecords] = useState([]);
    const [frequency, setFrequency] = useState({ thisWeek: 0, thisMonth: 0, thisYear: 0 });
    const [weeklyData, setWeeklyData] = useState([]);
    const [muscleDistribution, setMuscleDistribution] = useState([]);

    const fetchWithAuth = async (url, options = {}) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            throw new Error('No token');
        }
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
            throw new Error('API error');
        }
        
        return response.json();
    };

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                // Fetch all data except volume (handled by separate component)
                const [overviewRes, prRes, frequencyRes, weeklyRes, muscleRes] = await Promise.allSettled([
                    fetchWithAuth('/api/analytics/overview'),
                    fetchWithAuth('/api/analytics/personal-records?limit=10'),
                    fetchWithAuth('/api/analytics/frequency'),
                    fetchWithAuth('/api/analytics/weekly-frequency'),
                    fetchWithAuth('/api/analytics/muscle-distribution')
                ]);

                // Process overview
                if (overviewRes.status === 'fulfilled' && overviewRes.value.success) {
                    setOverview(overviewRes.value.data);
                }

                // Process personal records
                if (prRes.status === 'fulfilled' && prRes.value.success) {
                    setPersonalRecords(prRes.value.data || []);
                }

                // Process frequency stats
                if (frequencyRes.status === 'fulfilled' && frequencyRes.value.success) {
                    setFrequency(frequencyRes.value.data);
                }

                // Process weekly frequency chart
                if (weeklyRes.status === 'fulfilled' && weeklyRes.value.success) {
                    setWeeklyData(weeklyRes.value.data.days || []);
                }

                // Process muscle distribution
                if (muscleRes.status === 'fulfilled' && muscleRes.value.success) {
                    setMuscleDistribution(muscleRes.value.data || []);
                }

            } catch (error) {
                console.error('Failed to fetch analytics data:', error);
                setError('Failed to load analytics data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [navigate]);

    const formatVolume = (volume) => {
        if (volume >= 1000000) return (volume / 1000000).toFixed(1) + 'M';
        if (volume >= 1000) return (volume / 1000).toFixed(0) + 'K';
        return volume.toString();
    };

    const maxWeeklyCount = weeklyData.length > 0 ? Math.max(...weeklyData.map(d => d.count), 1) : 1;

    if (isLoading) {
        return (
            <AppLayout>
                <div className="analytics-page">
                    <div className="analytics-header">
                        <h1 className="analytics-title">Analytics</h1>
                    </div>
                    <div className="analytics-content">
                        <div className="analytics-loading">
                            <p>Loading analytics...</p>
                        </div>
                    </div>
                    <BottomNav />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="analytics-page">
                <div className="dashboard-header">
                    <div className="dashboard-header-left">
                        <h1 className="dashboard-title">Analytics</h1>
                    </div>
                </div>

                <div className="analytics-content">
                    {/* Overview Stats */}
                    <div className="analytics-overview">
                        <div className="analytics-stat-card">
                            <span className="analytics-stat-icon">💪</span>
                            <div className="analytics-stat-content">
                                <span className="analytics-stat-value">{overview.totalWorkouts}</span>
                                <span className="analytics-stat-label">Total Workouts</span>
                            </div>
                        </div>
                        <div className="analytics-stat-card">
                            <span className="analytics-stat-icon">🏋️</span>
                            <div className="analytics-stat-content">
                                <span className="analytics-stat-value">{formatVolume(overview.totalVolume)} kg</span>
                                <span className="analytics-stat-label">Total Volume</span>
                            </div>
                        </div>
                    </div>

                    {/* Personal Records */}
                    <section className="analytics-section">
                        <h2 className="analytics-section-title">Personal Records (PR)</h2>
                        <p className="analytics-section-subtitle">Your highest lifts</p>
                        {personalRecords.length > 0 ? (
                            <div className="analytics-pr-grid">
                                {personalRecords.map((pr) => (
                                    <div key={pr.id} className="analytics-pr-card">
                                        <div className="analytics-pr-header">
                                            <span className="analytics-pr-name">{pr.exerciseName}</span>
                                            {pr.equipment && (
                                                <span className="analytics-pr-equipment">{pr.equipment}</span>
                                            )}
                                        </div>
                                        <div className="analytics-pr-value">
                                            <span className="analytics-pr-weight">{pr.weight}</span>
                                            <span className="analytics-pr-unit">kg</span>
                                            <span className="analytics-pr-reps">× {pr.reps}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="analytics-empty">
                                <p>No personal records yet. Start lifting!</p>
                            </div>
                        )}
                    </section>

                    {/* Volume Chart */}
                    <section className="analytics-section">
                        <div className="analytics-section-header">
                            <div>
                                <h2 className="analytics-section-title">Training Volume Chart</h2>
                                <p className="analytics-section-subtitle">Track your workout intensity over time</p>
                                <p className="analytics-section-info">📊 Total weight lifted (kg) per {activeVolumePeriod === 'weekly' ? 'week' : 'month'}</p>
                            </div>
                            <div className="analytics-toggle-group">
                                <button 
                                    className={`analytics-toggle-btn ${activeVolumePeriod === 'weekly' ? 'active' : ''}`}
                                    onClick={() => setActiveVolumePeriod('weekly')}
                                >
                                    Weekly
                                </button>
                                <button 
                                    className={`analytics-toggle-btn ${activeVolumePeriod === 'monthly' ? 'active' : ''}`}
                                    onClick={() => setActiveVolumePeriod('monthly')}
                                >
                                    Monthly
                                </button>
                            </div>
                        </div>
                        <VolumeChart activePeriod={activeVolumePeriod} />
                    </section>

                    {/* Workout Frequency */}
                    <section className="analytics-section">
                        <h2 className="analytics-section-title">Workout Frequency</h2>
                        <p className="analytics-section-subtitle">How often you work out</p>
                        <p className="analytics-section-info">📅 Number of logged workout sessions</p>
                        
                        <div className="analytics-toggle-group analytics-toggle-group--center">
                            <button 
                                className={`analytics-toggle-btn ${activeViewMode === 'stats' ? 'active' : ''}`}
                                onClick={() => setActiveViewMode('stats')}
                            >
                                Stats
                            </button>
                            <button 
                                className={`analytics-toggle-btn ${activeViewMode === 'chart' ? 'active' : ''}`}
                                onClick={() => setActiveViewMode('chart')}
                            >
                                Chart
                            </button>
                        </div>

                        {activeViewMode === 'stats' ? (
                            <div className="analytics-frequency-stats">
                                <div className="analytics-frequency-stat">
                                    <span className="analytics-frequency-label">This Week</span>
                                    <span className="analytics-frequency-value">{frequency.thisWeek} sessions</span>
                                </div>
                                <div className="analytics-frequency-stat">
                                    <span className="analytics-frequency-label">This Month</span>
                                    <span className="analytics-frequency-value">{frequency.thisMonth} sessions</span>
                                </div>
                                <div className="analytics-frequency-stat">
                                    <span className="analytics-frequency-label">This Year</span>
                                    <span className="analytics-frequency-value">{frequency.thisYear} sessions</span>
                                </div>
                            </div>
                        ) : (
                            <div className="analytics-frequency-chart">
                                {weeklyData.map((day) => {
                                    const height = maxWeeklyCount > 0 ? (day.count / maxWeeklyCount) * 100 : 0;
                                    return (
                                        <div key={day.day} className="analytics-frequency-bar">
                                            <div 
                                                className="analytics-frequency-bar-fill" 
                                                style={{ height: `${height}%` }}
                                            />
                                            <span className="analytics-frequency-bar-count">{day.count}</span>
                                            <span className="analytics-frequency-bar-day">{day.day}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* Muscle Distribution */}
                    <section className="analytics-section">
                        <h2 className="analytics-section-title">Muscle Distribution</h2>
                        <p className="analytics-section-subtitle">Workout distribution by target muscle</p>
                        {muscleDistribution.length > 0 ? (
                            <div className="analytics-muscle-list">
                                {muscleDistribution.map((item) => (
                                    <div key={item.muscle} className="analytics-muscle-item">
                                        <div className="analytics-muscle-info">
                                            <span className="analytics-muscle-name">{item.muscle}</span>
                                            <span className="analytics-muscle-percentage">{item.percentage}%</span>
                                        </div>
                                        <div className="analytics-muscle-bar">
                                            <div 
                                                className="analytics-muscle-bar-fill" 
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="analytics-empty">
                                <p>No muscle distribution data yet.</p>
                            </div>
                        )}
                    </section>
                </div>

                <BottomNav />
            </div>
        </AppLayout>
    );
};

export default Analytics;
