#!/bin/bash

echo "setting up app..."

if ! [ -x "$(command -v mocha)" ]; then
  npm install mocha -g
fi

if ! [ -x "$(command -v grunt)" ]; then
  npm install grunt -g
fi

if ! [ -x "$(command -v phantomjs)" ]; then
  npm install phantomjs -g
fi

npm install
