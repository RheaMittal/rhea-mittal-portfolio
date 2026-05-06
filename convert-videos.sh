#!/bin/bash

ASSETS_DIR="$(dirname "$0")/assets"

find "$ASSETS_DIR" \( -name "*.mov" -o -name "*.mp4" \) | while read -r input; do
  # Skip files that are already converted (end in _web.mp4)
  if [[ "$input" == *"_web.mp4" ]]; then
    continue
  fi

  dir="$(dirname "$input")"
  base="$(basename "${input%.*}")"
  output="$dir/${base}_web.mp4"

  if [ -f "$output" ]; then
    echo "SKIP (already exists): $output"
    continue
  fi

  echo "Converting: $input"
  ffmpeg -i "$input" -vcodec h264 -an -crf 23 -movflags faststart "$output" -y -loglevel error

  original_size=$(du -sh "$input" | cut -f1)
  new_size=$(du -sh "$output" | cut -f1)
  echo "  Done: $original_size → $new_size"
done

echo ""
echo "All done."
