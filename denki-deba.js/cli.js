#!/usr/bin/env node

var path = require('path');
const denkiDeba = require("./denki-deba");

const { JSDOM } = require("jsdom");

function serialize(jsdom) {
  const result = denkiDeba(jsdom.window.document);
  process.stdout.write(result.title + "\n\n" + result.text + "\n");
}

const arg = process.argv[2];

if(arg.startsWith("http:") || arg.startsWith("https:") || arg.startsWith("file:")) {
  JSDOM.fromURL(arg).then(serialize);
}
else {
  JSDOM.fromFile(arg).then(serialize);
}
