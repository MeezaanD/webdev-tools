#!/bin/bash

# Check for project name
if [ -z "$1" ]; then
  echo "Usage: newproject <project-name>"
  exit 1
fi

PROJECT_NAME="$1"
CURRENT_DIR="$(pwd)"                          # Use the directory where script is run
SCRIPT_DIR="$(cd "$(dirname "$0")"; pwd)"    # Absolute path to this script
TEMPLATE_DIR="$SCRIPT_DIR/template"          # Template folder relative to script

# Check if template folder exists
if [ ! -d "$TEMPLATE_DIR" ]; then
  echo "❌ Error: template folder not found at $TEMPLATE_DIR"
  echo "Make sure 'template/' exists inside the script folder."
  exit 1
fi

TARGET="$CURRENT_DIR/$PROJECT_NAME"

# Check if target folder already exists
if [ -d "$TARGET" ]; then
  echo "❌ Error: Project '$PROJECT_NAME' already exists at $TARGET"
  exit 1
fi

# Create the new project and copy template
mkdir -p "$TARGET"
cp -r "$TEMPLATE_DIR/." "$TARGET"

echo "✨ Project '$PROJECT_NAME' created successfully!"
echo "➡ Location: $TARGET"
