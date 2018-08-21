"use strict";

var setchakuzai = (function() {
  function normalise(text) {
    return text.replace(/\s+/g, " ").trim();
  }

  function parseHeading(text) {
    const parts = text.match(/^(#+) (.*)$/);

    return {
      level: parts[1].length,
      content: parts[2]
    }
  }

  function generateHeading(level, content) {
    return "#".repeat(level) + " " + content;
  }

  function parseDocument(text) {
    const nodes = text.split(/(?:\r?\n){2,}/g);

    var outNodes = [];
    for(const node of nodes) {
      const cleanedNode = normalise(node);
      if(cleanedNode == "") continue;

      outNodes.push(cleanedNode);
    }

    return outNodes;
  }

  function indentHeadings(nodes) {
    var outNodes = [];

    for(const node of nodes) {
      if(node.startsWith("#")) {
        var { level, content } = parseHeading(node);
        if(level < 6) level += 1;

        outNodes.push(generateHeading(level, content));
      }
      else {
        outNodes.push(node);
      }
    }

    return outNodes;
  }

  function repairHeadings(nodes) {
    return nodes;
  }

  return function(documents) {
    var nodes = [];
    for(const text of documents) nodes = nodes.concat(indentHeadings(parseDocument(text)));
    nodes = repairHeadings(nodes);
    return nodes.join("\n\n");
  }
})();

if(typeof module === "object" && typeof module.exports === "object") module.exports = setchakuzai;