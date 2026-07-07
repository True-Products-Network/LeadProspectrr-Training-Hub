#!/bin/bash
# Quick trigger for course-content-creator skill
# Usage: ./scripts/create-lessons.sh [path-to-json-file-or-directory]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SKILL_DIR="$PROJECT_DIR/skills/course-content-creator"

# Check if skill directory exists
if [ ! -d "$SKILL_DIR" ]; then
    echo "❌ Skill not found at: $SKILL_DIR"
    exit 1
fi

cd "$SKILL_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run the skill
if [ $# -eq 0 ]; then
    # No arguments - run interactive mode
    echo "🎓 Starting Course Content Creator (Interactive Mode)"
    echo "   Press Ctrl+C to exit"
    echo ""
    npx ts-node create-lesson.ts
else
    # Argument provided - run batch/directory mode
    INPUT_PATH="$1"
    
    # Convert relative paths to absolute
    if [[ ! "$INPUT_PATH" = /* ]]; then
        INPUT_PATH="$(pwd)/$INPUT_PATH"
    fi
    
    echo "🎓 Course Content Creator"
    echo "   Input: $INPUT_PATH"
    echo ""
    
    npx ts-node create-lesson.ts "$INPUT_PATH"
fi
