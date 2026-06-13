# Supabase Storage Setup Guide

## 1. Buat Project Supabase (Storage Only)

1. Buka https://supabase.com/dashboard
2. Klik "New Project"
3. Isi nama project (misal: "gym-tracker-storage")
4. Set password dan region
5. **Catat:** `Project URL` dan `anon/public key` dari Settings > API

## 2. Buat Storage Bucket

1. Di sidebar, pilih **Storage**
2. Klik **New bucket**
3. Bucket name: `exercise-images`
4. Set as: **Public bucket**
5. Klik Create

## 3. Setup RLS (Row Level Security)

1. Pilih bucket `exercise-images`
2. Tab **Policies**
3. Klik **Add policy** untuk insert:
   - Policy name: `Public insert`
   - Target roles: `anon`
   - USING expression: `true`
   - WITH CHECK expression: `true`

4. Add policy lagi untuk select:
   - Policy name: `Public read`
   - Target roles: `anon`
   - USING expression: `true`
   - WITH CHECK expression: `true`

## 4. Setup CORS (Opsional untuk direct upload)

Pergi ke **Storage** > **Settings** > **Cors** dan tambahkan:
```
Origin: http://localhost:3000
Methods: GET, POST, PUT, DELETE, OPTIONS
Headers: *
```

## 5. Update .env

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

## 6. Folder Structure

Upload gambar ke bucket dengan struktur:
```
exercise-images/
├── exercises/
│   ├── bench-press.png
│   ├── squat.png
│   └── deadlift.png
└── avatars/
```

## 7. Image URL Format

URL publik format:
```
https://[project-id].supabase.co/storage/v1/object/public/exercise-images/exercises/bench-press.png
```

---

## Backend Integration

Update model Exercise di backend:
```prisma
model Exercise {
  // ...existing fields
  imageUrl String?
}
```

Update API untuk handle image URL.
