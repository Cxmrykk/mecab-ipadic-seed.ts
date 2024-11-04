#!/bin/bash

# Expand the .tar.xz archive

# Check if an argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <archive_file>"
  exit 1
fi

# Set the input file
input_file="$1"

# Check if the input file exists
if [ ! -f "$input_file" ]; then
  echo "Error: Input file '$input_file' not found."
  exit 1
fi

# Extract the archive into the same directory, stripping the first component
# Get the directory of the input file
output_dir=$(dirname "$input_file")

tar -xf "$input_file" -C "$output_dir" --strip-components=1

echo "Decompression of '$input_file' complete."