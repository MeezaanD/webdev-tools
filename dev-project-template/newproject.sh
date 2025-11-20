#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: newproject <project-name>"
  exit 1
fi

TARGET=~/dev/projects/$1

mkdir -p "$TARGET"
cp -r "$(dirname "$0")/template/." "$TARGET"

echo "✨ Project '$1' created with your global template!"
echo "➡ Location: $TARGET"
