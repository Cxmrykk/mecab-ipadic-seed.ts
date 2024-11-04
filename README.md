# @cxmrykk/mecab-ipadic-seed.ts

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

To manually extract:

```sh
# Remove and create 'dict' folder
rm -rf ./dict && mkdir ./dict

# Copy the archive into the 'dict' folder
cp mecab-ipadic-2.7.0-20070801.tar.xz ./dict

# Extract the archive
./bin/extract.sh ./dict

# Remove the archive
rm ./dict/mecab-ipadic-2.7.0-20070801.tar.xz
```

To convert from `.tar.gz` archive to `.tar.xz`, with UTF-8 encoding:

```sh
# Remove and create 'dict' folder
rm -rf ./dict && mkdir ./dict

# Copy the archive into the 'dict' folder
cp path/to/archive ./dict

# Run the conversion script
./bin/convert.sh path/to/archive

# Output: ./dict/archive.tar.xz
```

This project was created using `bun init` in bun v1.1.27. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
