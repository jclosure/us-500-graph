@echo off

set debug=%1

set NEO4J_URL=http://neo4j:admin@localhost:7474


IF [%debug%] NEQ [] (
   node-debug app.js
) ELSE (
   node app.js
)

