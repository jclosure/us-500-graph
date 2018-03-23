#!/bin/bash

export DEBUG_MODE=$1

export NEO4J_URL=http://neo4j:admin@localhost:7474

if [ -n "$DEBUG_MODE" ]; then
  node-debug app.js
else
  node app.js
fi
