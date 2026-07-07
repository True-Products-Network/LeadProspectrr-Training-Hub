# Module Creation Checklist

**Use this checklist before creating any new training module to ensure seamless deployment.**

## Pre-Requisites (REQUIRED)

Before creating lessons for a new module, verify these database requirements:

### 1. Database Schema Verification

Run this SQL in Supabase to verify all required columns exist:

```sql
-- Check lesson_progress table has all required columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'lesson_progress' 
ORDER BY ordinal_position;
```

**Required columns:**
- `id` (uuid)
- `user_id` (uuid)
- `lesson_id` (uuid)
- `status` (text)
- `started_at` (timestamp with time zone)
- `completed_at` (timestamp with time zone)
- `time_spent_minutes` (integer)
- `points_earned` (integer)
- `created_at` (timestamp with time zone)

If `started_at` is missing, run:
```sql
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE;
```

### 2. Activity Type Constraint Verification

Verify the user_activity table accepts lesson activity types:

```sql
-- Check current constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'user_activity'::regclass;
```

**Must include:** `'lesson_start'` and `'lesson_complete'`

If missing, run migration `034_fix_activity_type_constraint.sql`

### 3. Training Module Exists

Verify the module exists in the database:

```sql
SELECT id, week_number, title 
FROM public.training_modules 
WHERE week_number = [YOUR_MODULE_NUMBER];
```

If the module doesn't exist, create it first:
```sql
INSERT INTO public.training_modules (
  week_number, year, cycle_number, title, description, color, is_active
) VALUES (
  [WEEK_NUMBER], 
  2026, 
  1, 
  'Your Module Title',
  'Module description',
  'blue',
  true
);
```

## Lesson Creation Process

### Step 1: Prepare Lesson Content

Create a JSON file with all lessons for the module following the format in `skills/course-content-creator/SKILL.md`

**Critical requirements:**
- Each lesson must have a unique `slug`
- `moduleWeek` must match the week_number in training_modules
- Exactly 3 quiz questions per lesson
- All slugs must be added to `lessonGoals` and `lessonObjectives` in `page.tsx`

### Step 2: Generate SQL

```bash
cd skills/course-content-creator
npm start ./your-module-lessons.json
```

### Step 3: Review Generated SQL

**CRITICAL:** The generated SQL must use `INSERT` not just `UPDATE`:

```sql
-- CORRECT - Uses INSERT with ON CONFLICT
INSERT INTO public.lessons (module_id, lesson_number, title, slug, ...)
VALUES (...)
ON CONFLICT (slug) DO UPDATE SET ...;

-- WRONG - Only UPDATE (will fail if lesson doesn't exist)
UPDATE public.lessons SET ... WHERE slug = '...';
```

If the skill generates only UPDATE statements, modify the SQL to use INSERT...ON CONFLICT pattern.

### Step 4: Add Learning Goals and Objectives

Before running SQL, update `src/app/dashboard/training/lesson/[slug]/page.tsx`:

Add entries to `lessonGoals`:
```typescript
const lessonGoals: Record<string, string> = {
  // Existing lessons...
  
  // Module X: Your Module Name
  'your-lesson-slug': 'Learning goal description here',
  // ... add all lesson slugs
}
```

Add entries to `lessonObjectives`:
```typescript
const lessonObjectives: Record<string, string[]> = {
  // Existing lessons...
  
  // Module X: Your Module Name
  'your-lesson-slug': [
    'First learning objective',
    'Second learning objective',
    'Third learning objective'
  ],
  // ... add all lesson slugs
}
```

### Step 5: Run Migrations in Order

Execute SQL files in this order:

1. **Module creation** (if new module): Insert training_modules record
2. **Lesson insertion**: Run the generated SQL from the skill
3. **Quiz insertion**: Run quiz SQL if separate

### Step 6: Verify in Database

After running SQL, verify lessons exist:

```sql
SELECT lesson_number, title, slug, is_published
FROM public.lessons l
JOIN public.training_modules m ON l.module_id = m.id
WHERE m.week_number = [YOUR_MODULE_NUMBER]
ORDER BY lesson_number;
```

### Step 7: Test Lesson Completion

1. Navigate to the first lesson in the new module
2. Click "Complete Lesson"
3. Verify no 500 errors in console
4. Verify lesson shows as completed
5. Verify next lesson unlocks

## Common Issues & Solutions

### Issue: "column 'started_at' does not exist"
**Solution:** Run migration `037_fix_lesson_progress_columns.sql`

### Issue: "activity_type check constraint violated"
**Solution:** Run migration `034_fix_activity_type_constraint.sql`

### Issue: "Lesson not found" when completing
**Solution:** The lesson wasn't inserted properly. Check if slug matches between INSERT and the URL.

### Issue: Module shows 0 lessons
**Solution:** Lessons were created with wrong module_id. Verify the module_id in the INSERT matches the training_modules record.

## Files That Must Be Updated for New Modules

1. **`src/app/dashboard/training/lesson/[slug]/page.tsx`**
   - Add lessonGoals entries
   - Add lessonObjectives entries

2. **Database migrations** (in order):
   - Ensure `034_fix_activity_type_constraint.sql` has run
   - Ensure `037_fix_lesson_progress_columns.sql` has run
   - New module lesson SQL

## Automation Wishlist

Future improvements to automate:
- [ ] Auto-generate learning goals/objectives entries
- [ ] Validate all slugs exist in page.tsx before allowing SQL generation
- [ ] Auto-check database schema before lesson creation
- [ ] Single command that does: generate SQL + update page.tsx + validate

## Related Documentation

- `skills/course-content-creator/SKILL.md` - Lesson creation skill
- `docs/DATABASE_SCHEMA.md` - Full database schema documentation
- `supabase/migrations/` - All database migrations
