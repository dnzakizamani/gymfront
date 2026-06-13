// ============================================================================
// CORE TYPES - Matches Prisma Schema
// Using JSDoc for type annotations (JavaScript project)
// ============================================================================

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string|null} fullName
 * @property {boolean} isAdmin
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Equipment
 * @property {string} id
 * @property {string} name
 * @property {string|null} description
 * @property {string} createdAt
 */

/**
 * @typedef {Object} MuscleGroup
 * @property {string} id
 * @property {string} name
 * @property {'push'|'pull'|'legs'|'core'|null} category
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Exercise
 * @property {string} id
 * @property {string} name
 * @property {string|null} description
 * @property {string|null} imageUrl
 * @property {string} equipmentId
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {Equipment} [equipment]
 * @property {ExerciseMuscle[]} [exerciseMuscles]
 */

/**
 * @typedef {Object} ExerciseMuscle
 * @property {string} id
 * @property {string} exerciseId
 * @property {string} muscleGroupId
 * @property {boolean} isPrimary
 * @property {string} createdAt
 * @property {Exercise} [exercise]
 * @property {MuscleGroup} [muscleGroup]
 */

/**
 * @typedef {Object} UserExercise
 * @property {string} id
 * @property {string} userId
 * @property {string} exerciseId
 * @property {string|null} customName
 * @property {string|null} notes
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {Exercise} [exercise]
 * @property {User} [user]
 */

/**
 * @typedef {Object} WorkoutSession
 * @property {string} id
 * @property {string} userId
 * @property {string} userExerciseId
 * @property {string} workoutDate - YYYY-MM-DD format
 * @property {string|null} notes
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string|null} exerciseId - Denormalized
 * @property {WorkoutSet[]} [sets]
 * @property {UserExercise} [userExercise]
 * @property {Exercise} [exercise]
 */

/**
 * @typedef {Object} WorkoutSet
 * @property {string} id
 * @property {string} sessionId
 * @property {number} setNumber
 * @property {number} weight - Decimal stored as number
 * @property {number} reps
 * @property {string|null} notes
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {WorkoutSession} [session]
 */

// ============================================================================
// API RESPONSE TYPES - With relations included
// ============================================================================

/**
 * @typedef {Exercise & {
 *   equipment: Equipment,
 *   exerciseMuscles: (ExerciseMuscle & { muscleGroup: MuscleGroup })[]
 * }} ExerciseWithDetails
 */

/**
 * @typedef {UserExercise & {
 *   exercise: ExerciseWithDetails
 * }} UserExerciseWithDetails
 */

/**
 * @typedef {WorkoutSession & {
 *   sets: WorkoutSet[]
 * }} WorkoutSessionWithSets
 */

// ============================================================================
// DERIVED TYPES FOR UI - Computed values
// ============================================================================

/**
 * @typedef {Object} ExerciseCardData
 * @property {string} id - UserExercise ID
 * @property {string} name
 * @property {string} equipment
 * @property {string} primaryMuscle
 * @property {string|null} secondaryMuscle
 * @property {string|null} lastSession
 * @property {number|null} personalRecord
 * @property {number} totalSessions
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalExercises
 * @property {number} activeExercises
 * @property {number} totalPRs
 * @property {number} thisWeekSessions
 */

/**
 * @typedef {Object} ExerciseStats
 * @property {number|null} personalRecord
 * @property {number} totalSessions
 * @property {string|null} lastSessionDate
 * @property {number} totalVolume
 */

/**
 * @typedef {Object} ChartDataPoint
 * @property {string} date
 * @property {number} weight
 * @property {string} label
 */

// ============================================================================
// FORM TYPES
// ============================================================================

/**
 * @typedef {Object} LoginFormData
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterFormData
 * @property {string} email
 * @property {string} password
 * @property {string} [confirmPassword]
 * @property {string} [fullName]
 */

/**
 * @typedef {Object} LogWorkoutFormData
 * @property {string} userExerciseId
 * @property {string} workoutDate
 * @property {{ weight: number, reps: number, notes?: string }[]} sets
 * @property {string} [notes]
 */

/**
 * @typedef {Object} AddExerciseData
 * @property {string} exerciseId
 * @property {string} [customName]
 * @property {string} [notes]
 */

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * @typedef {Object} ApiResponse
 * @property {any} data
 * @property {string|null} error
 */

/**
 * @typedef {Object} AuthResponse
 * @property {User} user
 * @property {string} token
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {any[]} data
 * @property {number} total
 * @property {number} page
 * @property {number} pageSize
 * @property {number} totalPages
 */

// ============================================================================
// FILTER TYPES
// ============================================================================

/** @type {Array<'All'|'Back'|'Chest'|'Legs'|'Shoulders'|'Arms'|'Core'>} */
export const MUSCLE_GROUPS = ['All', 'Back', 'Chest', 'Legs', 'Shoulders', 'Arms', 'Core'];

// ============================================================================
// API SERVICE - Ready for backend integration
// ============================================================================

const API_BASE_URL = '/api';

/**
 * Generic fetch wrapper with auth
 * @param {string} endpoint
 * @param {RequestInit} options
 * @returns {Promise<any>}
 */
export const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};

// ============================================================================
// API ENDPOINTS - As defined in FRONTEND_ARCHITECTURE.md
// ============================================================================

export const api = {
    // Auth
    login: (data) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => apiFetch('/auth/logout', { method: 'POST' }),
    me: () => apiFetch('/auth/me'),

    // Exercises (Master data - public)
    getExercises: (params) => apiFetch(`/exercises${params ? `?${params}` : ''}`),
    getExercise: (id) => apiFetch(`/exercises/${id}`),

    // User Exercises
    getUserExercises: () => apiFetch('/user-exercises'),
    addUserExercise: (data) => apiFetch('/user-exercises', { method: 'POST', body: JSON.stringify(data) }),
    removeUserExercise: (id) => apiFetch(`/user-exercises/${id}`, { method: 'DELETE' }),

    // Workouts
    getWorkouts: (userExerciseId) => apiFetch(`/workouts?userExerciseId=${userExerciseId}`),
    createWorkout: (data) => apiFetch('/workouts', { method: 'POST', body: JSON.stringify(data) }),
    updateWorkout: (id, data) => apiFetch(`/workouts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteWorkout: (id) => apiFetch(`/workouts/${id}`, { method: 'DELETE' }),

    // Stats/Progress
    getExerciseProgress: (exerciseId) => apiFetch(`/progress/exercise/${exerciseId}`),
    getDashboardStats: () => apiFetch('/stats'),
    getPR: (exerciseId) => apiFetch(`/pr/${exerciseId}`),
};
