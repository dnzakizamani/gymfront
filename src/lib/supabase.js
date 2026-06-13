import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

/**
 * Get public URL for a storage file
 * @param {string} bucket - Bucket name
 * @param {string} path - File path within bucket
 * @returns {string} Public URL
 */
export const getStorageUrl = (bucket, path) => {
    if (!path) return null;
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

/**
 * Exercise image helper
 * @param {string|null} imageUrl - Image URL from database
 * @returns {string|null} Full URL or null
 */
export const getExerciseImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If already full URL (external), return as is
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }
    
    // If Supabase storage path
    return getStorageUrl('exercise-images', imageUrl);
};
