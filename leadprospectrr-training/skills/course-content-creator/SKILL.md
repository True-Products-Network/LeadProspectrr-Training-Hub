# Course Content Creator Skill

Create visually engaging, interactive course lesson content with consistent formatting, color-coded sections, and responsive HTML structure.

## Purpose

This skill generates course lesson content files that follow a proven visual design pattern:
- Learning Goal section with target icon
- Interactive content cards with icons
- Key Point callouts
- Action Steps with numbered cards
- Quiz questions with multiple choice answers
- Consistent color scheme and visual hierarchy

## Features

✅ **Interactive CLI** - Step-by-step guided lesson creation  
✅ **Quiz Generation** - Multiple choice questions with explanations  
✅ **Multiple Module Support** - Specify any module week/name  
✅ **Batch Creation** - Generate from single JSON file or directory of files  
✅ **JSON Validation** - Validates lesson structure before generating SQL  
✅ **20+ Built-in Icons** - target, pencil, users, link, image, video, etc.  
✅ **10 Color Schemes** - blue, green, amber, purple, rose, cyan, indigo, violet, teal, pink  

## Usage

### Interactive Mode

```bash
cd skills/course-content-creator
npm install
npm start
```

Follow the prompts to create your lesson interactively.

### Batch Mode (JSON)

Create a JSON file with one or multiple lessons:

```bash
npm start lessons-batch.json
```

### Directory Mode (Multiple Files)

Process all JSON files in a directory:

```bash
npm start ./lessons/
```

This will:
- Load all `.json` files from the directory (sorted alphabetically)
- Validate each lesson
- Generate individual SQL files in `generated-sql/`
- Create a combined `all-lessons.sql` file

## Output Format

Generates SQL migration files that can be run against Supabase/PostgreSQL to insert/update:
- Lesson content (HTML with visual design)
- Quiz questions and options

## Example JSON Format

### Single Lesson (Object)

```json
{
  "lessonNumber": 1,
  "slug": "lesson-slug",
  "title": "Lesson Title",
  "moduleWeek": 1,
  "moduleName": "Module Name",
  "learningGoal": "What students will learn",
  "sections": [
    {
      "title": "Section Title",
      "icon": "pencil",
      "color": "blue",
      "items": [
        {
          "icon": "info",
          "color": "blue",
          "title": "Item Title",
          "description": "Item description"
        }
      ]
    }
  ],
  "keyPoint": "Key takeaway",
  "actionSteps": [
    {
      "number": 1,
      "title": "Step title",
      "description": "Step description"
    }
  ],
  "nextLessonTitle": "Next Lesson Title",
  "quizzes": [
    {
      "question": "Quiz question 1?",
      "options": [
        { "option_text": "Option A", "is_correct": false },
        { "option_text": "Option B", "is_correct": true }
      ],
      "explanation": "Why B is correct"
    },
    {
      "question": "Quiz question 2?",
      "options": [
        { "option_text": "Option A", "is_correct": true },
        { "option_text": "Option B", "is_correct": false }
      ],
      "explanation": "Why A is correct"
    },
    {
      "question": "Quiz question 3?",
      "options": [
        { "option_text": "Option A", "is_correct": false },
        { "option_text": "Option B", "is_correct": true }
      ],
      "explanation": "Why B is correct"
    }
  ]
}
```

### Multiple Lessons (Array)

```json
[
  { /* lesson 1 */ },
  { /* lesson 2 */ }
]
```

## Validation Requirements

Each lesson must have:
- ✅ All required fields (lessonNumber, slug, title, moduleWeek, moduleName, learningGoal, keyPoint, nextLessonTitle)
- ✅ At least one section
- ✅ At least one action step
- ✅ **Exactly 3 quiz questions** (required)
- ✅ Each quiz must have at least 2 options
- ✅ Each quiz must have exactly 1 correct answer

## Available Icons

- `target` - Learning goal
- `pencil` - Writing/editing
- `info` - Information
- `users` - People/audience
- `tag` - Categories/tags
- `link` - Links/URLs
- `image` - Images/media
- `search` - SEO/search
- `eye` - Preview/view
- `check` - Checkmarks
- `clock` - Schedule/time
- `share` - Sharing
- `lightbulb` - Key points
- `checklist` - Action steps
- `warning` - Warnings
- `star` - Achievements
- `mail` - Email
- `chat` - Messages
- `location` - Location
- `settings` - Configuration
- `question` - Quiz questions
- `book` - Reading/learning
- `video` - Video content
- `document` - Documents
- `download` - Downloads
- `play` - Play button
- `trophy` - Completion

## Available Colors

- `blue` - Primary/info
- `green` - Success/positive
- `amber` - Warning/attention
- `purple` - Creative/special
- `rose` - Important/urgent
- `cyan` - Tech/digital
- `indigo` - Professional
- `violet` - Premium/quality
- `teal` - Growth/progress
- `pink` - Friendly/approachable

## Files

- `SKILL.md` - This documentation
- `create-lesson.ts` - Main skill implementation
- `package.json` - Dependencies
- `example-lesson.json` - Example single lesson file
- `example-lessons.json` - Example batch file with multiple lessons

## Output

All generated SQL files are placed in the `generated-sql/` directory:
- Individual files: `lesson_{number}_{slug}.sql`
- Combined file: `all-lessons.sql`

## Requirements

- Node.js 18+
- TypeScript
- Output compatible with Supabase/PostgreSQL

## Author

Created for LeadProspectrr Training Hub
