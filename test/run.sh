#!/bin/sh

for f in $(ls "$(dirname "$0")"/*.js); do
    echo "=> $f"
    node "$f"
done
