#!/usr/bin/env node
"use strict";

const fs = require('fs');
const setchakuzai = require("./setchakuzai.js");
const { orderBy } = require('natural-orderby');

const paths = orderBy(process.argv.slice(2));

const documents = [];
for(const path of paths) documents.push(fs.readFileSync(path, { encoding: 'utf8' }));

process.stdout.write(setchakuzai(documents) + "\n");

