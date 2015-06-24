#!/bin/bash

# Get the commit details
THE_COMMIT=`git rev-parse HEAD`

# Set git details
git config --global user.email "travis@iampjl.co.uk"
git config --global user.name "Travis CI"

# Delete _dist
rm -rf _dist
mkdir _dist

# Run grunt
grunt prd

# Push to git by overriding previous commits
# IMPORTANT: Supress messages so nothing appears in logs
cd _dist
git init
git remote rm origin
git remote add origin https://PJL101:${GH_TOKEN}@github.com/PJL101/pjl101.github.io.git
git add -A
git commit -m "Travis GitHub Pages auto build for $THE_COMMIT"
git push --force --quiet origin master:gh-pages > /dev/null 2>&1
