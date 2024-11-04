#!/bin/bash

# Expand dict/mecab-ipadic-2.7.0-20070801.tar.gz
# Convert char encoding from EUC-JP to UTF-8
# Re-compress UTF-8 encoded files to dict/mecab-ipadic-2.7.0-20070801.tar.xz

# Check if an argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <archive_file.tar.gz>"
  exit 1
fi

# Set the input file
input_file="$1"

# Check if the input file exists
if [ ! -f "$input_file" ]; then
  echo "Error: Input file '$input_file' not found."
  exit 1
fi

# Extract the base filename without extension
base_name=$(basename "$input_file" .tar.gz)

# Create temporary directory
tmp_dir=$(mktemp -d)

# Extract the archive
tar -xzvf "$input_file" -C "$tmp_dir"

# Convert encoding and re-compress
pushd "$tmp_dir" >/dev/null

for file in "$base_name"/*.{csv,def}; do
  if [ -f "$file" ]; then
    iconv -f EUCJP -t UTF8 "$file" > "${file}.utf8"
    rm "$file"
    mv "${file}.utf8" "$file"
  fi
done

# Create the xz archive, disabling copyfile to avoid extended attributes issues
COPYFILE_DISABLE=1 tar -cJf "${input_file%.tar.gz}.tar.xz" "$base_name"

popd >/dev/null

# Remove temporary directory
rm -rf "$tmp_dir"

echo "Conversion and recompression of '$input_file' complete."