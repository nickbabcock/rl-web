#!/bin/bash -eu

# Poor man's asset pipeline
FILE="$1"
FILE_EXT="${FILE##*.}"
FILE_NAME="${FILE%.*}"
SHA=$(sha1sum < "dist/$FILE" | cut -d' ' -f1)
NEW_FILE="$FILE_NAME-$SHA.$FILE_EXT"
mv "dist/$FILE" "dist/$NEW_FILE"
sed -i -e "s/$FILE/$NEW_FILE/g" "$2"
