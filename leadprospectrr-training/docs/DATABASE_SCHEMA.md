# Database Schema Documentation

## Critical Tables for Lesson System

### `lesson_progress`
Tracks user progress on individual lessons.

**Columns:**
| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `id` | UUID | Yes | Primary key |
| `user_id` | UUID | Yes | Foreign key to users |
| `lesson_id` | UUID | Yes | Foreign key to lessons |
| `status` | TEXT | Yes | 'not_started', 'in_progress', 'completed' |
| `started_at` | TIMESTAMP | Yes | When user started lesson |
| `completed_at` | TIMESTAMP | Yes | When user completed lesson |
| `time_spent_minutes` | INTEGER | Yes | Time spent on lesson |
| `points_earned` | INTEGER | Yes | Points awarded |
| `created_at` | TIMESTAMP | Yes | Auto-generated |

**Verification SQL:**
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'lesson_progress' 
ORDER BY ordinal_position;
```

**Fix Missing Columns:**
```sql
-- Add missing columns
ALTER TABLE public.lesson_progress 
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS time_spent_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS points_earned INTEGER DEFAULT 0;
```

---

### `user_activity`
Tracks user activities for gamification.

**Columns:**
| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `id` | UUID | Yes | Primary key |
| `user_id` | UUID | Yes | Foreign key to users |
| `activity_date` | DATE | Yes | Date of activity |
| `activity_type` | TEXT | Yes | Type of activity |
| `metadata` | JSONB | No | Additional data |
| `created_at` | TIMESTAMP | Yes | Auto-generated |

**Allowed activity_type values:**
- `'login'`
- `'module_complete'`
- `'resource_download'`
- `'quiz_complete'`
- `'lesson_start'`
- `'lesson_complete'`

**Verification SQL:**
```sql
-- Check constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'user_activity'::regclass;
```

**Fix Constraint:**
```sql
ALTER TABLE public.user_activity 
DROP CONSTRAINT IF EXISTS user_activity_activity_type_check;

ALTER TABLE public.user_activity 
ADD CONSTRAINT user_activity_activity_type_check 
CHECK (activity_type IN ('login', 'module_complete', 'resource_download', 'quiz_complete', 'lesson_start', 'lesson_complete'));
```

---

### `lessons`
Stores lesson content and metadata.

**Columns:**
| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `id` | UUID | Yes | Primary key |
| `module_id` | UUID | Yes | Foreign key to training_modules |
| `lesson_number` | INTEGER | Yes | Order within module |
| `title` | TEXT | Yes | Lesson title |
| `slug` | TEXT | Yes | Unique URL slug |
| `description` | TEXT | No | Short description |
| `content` | TEXT | Yes | HTML content |
| `lesson_type` | TEXT | Yes | 'standard', 'video', etc. |
| `duration_minutes` | INTEGER | Yes | Estimated time |
| `points` | INTEGER | Yes | Points for completion |
| `is_published` | BOOLEAN | Yes | Visibility flag |
| `sort_order` | INTEGER | Yes | Display order |

**Verification SQL:**
```sql
-- Check lessons for a module
SELECT lesson_number, title, slug, is_published
FROM public.lessons l
JOIN public.training_modules m ON l.module_id = m.id
WHERE m.week_number = [MODULE_NUMBER]
ORDER BY lesson_number;
```

---

### `training_modules`
Stores training module information.

**Columns:**
| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `id` | UUID | Yes | Primary key |
| `week_number` | INTEGER | Yes | Module week number |
| `year` | INTEGER | Yes | Year (default 2026) |
| `cycle_number` | INTEGER | Yes | Cycle (default 1) |
| `title` | TEXT | Yes | Module title |
| `description` | TEXT | No | Module description |
| `color` | TEXT | Yes | UI color theme |
| `is_active` | BOOLEAN | Yes | Active flag |

**Verification SQL:**
```sql
SELECT id, week_number, title, is_active 
FROM public.training_modules 
ORDER BY week_number;
```

**Create New Module:**
```sql
INSERT INTO public.training_modules (
  week_number, year, cycle_number, title, description, color, is_active
) VALUES (
  [WEEK_NUMBER], 2026, 1, 'Module Title', 'Description', 'blue', true
);
```

---

## Triggers

### `lesson_progress_completion_trigger`
Fires when lesson progress is updated to 'completed'.

**Purpose:**
- Updates module progress status
- Records activity
- Awards points

**Verification SQL:**
```sql
-- Check trigger exists
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'lesson_progress';
```

---

## Common Issues & Fixes

### Issue: "column 'started_at' does not exist"
**Fix:**
```sql
ALTER TABLE public.lesson_progress 
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE;
```

### Issue: "activity_type check constraint violated"
**Fix:**
```sql
ALTER TABLE public.user_activity 
DROP CONSTRAINT IF EXISTS user_activity_activity_type_check;

ALTER TABLE public.user_activity 
ADD CONSTRAINT user_activity_activity_type_check 
CHECK (activity_type IN ('login', 'module_complete', 'resource_download', 'quiz_complete', 'lesson_start', 'lesson_complete'));
```

### Issue: "Lesson not found" when completing
**Cause:** Lesson slug in URL doesn't match database
**Fix:** Verify slug matches between INSERT SQL and URL

### Issue: Module shows 0 lessons
**Cause:** Lessons have wrong module_id
**Fix:** 
```sql
-- Check module_id
SELECT m.week_number, m.title, l.lesson_number, l.title, l.slug
FROM public.lessons l
JOIN public.training_modules m ON l.module_id = m.id
WHERE l.slug = 'your-lesson-slug';
```

---

## Migration History

Key migrations that must be run for lesson system to work:

| Migration | Purpose | Status |
|-----------|---------|--------|
| `009_add_lessons_system.sql` | Creates lessons and lesson_progress tables | Required |
| `031_add_started_at_to_lesson_progress.sql` | Adds started_at column | Required |
| `034_fix_activity_type_constraint.sql` | Adds lesson_start/lesson_complete types | Required |
| `035_insert_module2_lessons.sql` | Inserts Module 2 lessons | Per-module |
| `036_simplify_lesson_trigger.sql` | Makes trigger more resilient | Recommended |
| `037_fix_lesson_progress_columns.sql` | Ensures all columns exist | Required |

---

## Related Documentation

- `docs/MODULE_CREATION_CHECKLIST.md` - Step-by-step module creation guide
- `skills/course-content-creator/SKILL.md` - Lesson creation skill
