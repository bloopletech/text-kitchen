#!/usr/bin/env node

const Utils = {
  escape: function(text) {
    /*
    Escaping that needs to be done all the time.
    Of the ASCII punctuation that can be escaped in Markdown, the following can be ignored:
    '!', because it only has meaning before a '[' or after a '<', and both of those will be escaped
    '(' and ')', because they only have meaning after ']', which will be escaped.
    */
    text = text.replace(/([\\`*{}[\]#+\-_>~|])/g, '\\$1');
    //Conditional escaping for the '.' following a number that would start an ordinal list item
    text = text.replace(/^(\s*\d+)\. /g, '$1\\. ');

    return text;
  }
};

const BOLD_ITALIC_REGEX = /(?:(\W|^)(\*)|(\*)(\W|$)|(\W|^)(_)|(_)(\W|$))/;

function parseInlines(text) {
  const parts = text.split(BOLD_ITALIC_REGEX);

  if(parts.filter(function(part) { return part == "*"; }).length % 2 != 0) return Utils.escape(text);
  if(parts.filter(function(part) { return part == "_"; }).length % 2 != 0) return Utils.escape(text);

  var inBold = false;
  var inItalic = false;
  var markdown = [];

  for(const part of parts) {
    if(!part) continue;

    if(part == "*") {
      inBold = !inBold;
      markdown.push(inBold ? "**" : "**"); //Note that in_bold has been inverted, so this is inverted as well
    }
    else if(part == "_") {
      inItalic = !inItalic;
      markdown.push(inItalic ? "*" : "*"); //Note that in_italic has been inverted, so this is inverted as well
    }
    else {
      markdown.push(Utils.escape(part));
    }
  }

  return markdown.join("");
}

function parseHeading(text) {
  const parts = text.match(/^(#+) (.*)$/);
  if(!parts) return parseInlines(text);
  return parts[1] + " " + parseInlines(parts[2]);
}

function parseParagraph(text) {
  return parseInlines(text);
}

function atxToMarkdown(text) {
  const nodes = text.split(/(?:\r?\n){2,}/g);
  var markdown = [];

  for(const node of nodes) {
    if(node.startsWith("#")) markdown.push(parseHeading(node));
    else markdown.push(parseParagraph(node));
  }

  return markdown.join("\n\n") + "\n";
}

const fs = require("fs");

const inputPath = process.argv[2];

const { mtime, atime } = fs.statSync(inputPath);

const input = fs.readFileSync(inputPath, "utf8");
const output = atxToMarkdown(input);

fs.writeFileSync(inputPath, output);

fs.utimesSync(inputPath, atime, mtime);