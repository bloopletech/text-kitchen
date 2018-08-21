#!/usr/bin/env node
'use strict';

const denkiDeba = require('denki-deba');
const ume = require('ume-no-hana');
const { JSDOM } = require('jsdom');

const express = require('express');
const app = express();

function wrapResponse(response) {
  const style = `
html, body {
  margin: 0;
  padding: 0;
}

body {
  font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.4;
  color: #000000;
  background-color: #ffffff;
}

#container {
  max-width: 1000px;
  margin: 0 auto 0 auto;
  padding: 30px;
}

p {
  margin-top: 0;
  margin-bottom: 1.2em;
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 0;
  margin-bottom: 0.6em;
}

h1 {
  font-size: 36px;
}

h2 {
  font-size: 26px;
}

h3 {
  font-size: 22px;
}

h4 {
  font-size: 18px;
}

h5 {
  font-size: 16px;
}

h6 {
  font-size: 16px;
}`;
  
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      ${style}
    </style>
  </head>
  <body>
    <div id="container">
      ${response}
    </div>
  </body>
</html>
`;
}

app.get('/', function(req, res) {
  JSDOM.fromURL(req.query.url).then(function(jsdom) {
    const result = denkiDeba(jsdom.window.document);
    res.send(wrapResponse(ume(result.text)));
  });
})

app.listen(3000);