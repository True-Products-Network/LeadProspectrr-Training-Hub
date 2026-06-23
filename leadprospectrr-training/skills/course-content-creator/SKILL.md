# Course Content Creator Skill

Create visually engaging, interactive course lesson content with consistent formatting, color-coded sections, and responsive HTML structure.

## Purpose

This skill generates course lesson content files that follow a proven visual design pattern:
- Learning Goal section with target icon
- Interactive content cards with icons
- Key Point callouts
- Action Steps with numbered cards
- Consistent color scheme and visual hierarchy

## Usage

```
/skill course-content-creator
```

The skill will guide you through creating a lesson by asking for:
1. Lesson number and title
2. Learning goal (single statement)
3. Main content sections
4. Key points
5. Action steps

## Output Format

Generates SQL migration files that can be run against the database to insert/update lesson content.

## Example

Input:
- Lesson: "Why Blog Posts Matter"
- Goal: "Understand why creating blog posts helps your business"
- Content: Benefits of blogging, examples
- Key Point: "Content does not need to be perfect"
- Action Steps: 3 steps to prepare for next lesson

Output: Complete SQL file with visual HTML structure ready to run.

## Files

- `SKILL.md` - This file
- `create-lesson.ts` - Main skill implementation
- `templates/` - HTML templates for lesson sections

## Requirements

- Node.js 18+
- TypeScript
- Output compatible with Supabase/PostgreSQL

## Author

Created for LeadProspectrr Training Hub
