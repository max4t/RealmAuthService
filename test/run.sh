#!/bin/sh

set -e
for f in $(ls *.js); do
    node "$f"
done
