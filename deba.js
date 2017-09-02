(function(window) {
  "use strict";

  const Utils = {
    isPresent: function(text) {
      return text != "" && text.search(/^\s*$/) == -1;
    },
    normalise: function(text) {
      return text.replace(/\s+/g, " ").trim();
    }
  };

  function Stringifier(segments) {
    this.segments = segments;
  }

  Stringifier.prototype.chunkUpSegments = function() {
    const chunks = [];
    let lastType = null;
    let currentChunk = [];

    for(const segment of this.segments.concat(null)) {
      if(lastType == null || segment == null || segment.constructor.name != lastType) {
        if(currentChunk.length) {
          chunks.push([lastType, currentChunk]);
          currentChunk = [];

          if(segment == null) break;
        }

        lastType = segment.constructor.name;
      }

      currentChunk.push(segment);
    }

    return chunks;
  }

  Stringifier.prototype.stringify = function() {
    const chunks = this.chunkUpSegments();
    const output = [];

    for(const chunk of chunks) {
      const type = chunk[0];
      const text = chunk[1].join("");

      if(type == "Span") output.push(Utils.normalise(text));
      else output.push(text);
    }

    return output.join("");
  }

  function Span(text) {
    this.text = text;
  }

  Span.prototype.toString = function() {
    return this.text;
  }

  function FixedSpan(text) {
    this.text = text;
  }

  FixedSpan.prototype.toString = function() {
    return this.text;
  }

  function Heading(segments, level) {
    this.segments = segments;
    this.level = level;
  }

  Heading.prototype.toArray = function() {
    return ["######".substr(-this.level) + " "].concat(this.segments).concat(["\n\n"]);
  }

  function ListItem(segments, last, index) {
    this.segments = segments;
    this.last = last;
    this.index = index;
  }

  ListItem.prototype.toArray = function() {
    return [this.prefix()].concat(this.segments).concat(["\n" + (this.last ? "\n" : "")]);
  }

  ListItem.prototype.prefix = function() {
    if(this.index == null) return "* ";
    else return this.index + ". ";
  }

  function DefinitionTerm(segments) {
    this.segments = segments;
  }

  DefinitionTerm.prototype.toArray = function() {
    return this.segments.concat([":\n"]);
  }

  function DefinitionDescription(segments, last) {
    this.segments = segments;
    this.last = last;
  }

  DefinitionDescription.prototype.toArray = function() {
    return this.segments.concat(["\n" + (this.last ? "\n" : "")]);
  }

  function Paragraph(segments) {
    this.segments = segments;
  }

  Paragraph.prototype.toArray = function() {
    return this.segments.concat(["\n\n"]);
  }

  function Document(extractor) {
    this.extractor = extractor;
    this.content = "";

    this.start();
  }

  Document.prototype.getContent = function() {
    return this.content;
  }

  Document.prototype.push = function(segment) {
    this.segments.push(segment);
  }

  Document.prototype.break = function() {
    this.finish();
    this.start(Array.prototype.slice.call(arguments));
  }

  Document.prototype.finish = function() {
    if(!this.isPresent()) return;

    if(this.extractor.isInBlockquote()) this.content += "> ";
    this.content += this.blockContent();
  }

  Document.prototype.start = function(args) {
    this.segments = [];
    this.args = args || [];
  }

  Document.prototype.isPresent = function() {
    for(const segment of this.segments) {
      if((segment instanceof Span || segment instanceof FixedSpan) && Utils.isPresent(segment.toString())) return true;
    }
    return false;
  }

  Document.prototype.blockContent = function() {
    const blockType = this.args.shift();
    this.args.unshift(this.segments);
    this.args.unshift(null);

    const block = new (Function.prototype.bind.apply(blockType, this.args));

    return (new Stringifier(block.toArray())).stringify();
  }

  function Extractor(input) {
    this.nodes = this.arrayify(input).map(this.convertNode);

    this.HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
    this.BLOCK_INITIATING_TAGS = ["address", "article", "aside", "body", "blockquote", "div", "dd", "dl", "dt", "figure",
      "footer", "header", "li", "main", "nav", "ol", "p", "pre", "section", "td", "th", "ul"];
    this.ENHANCERS = { b: "*", strong: "*", i: "_", em: "_" };
    this.SKIP_TAGS = ["head", "style", "script", "noscript"];
  }

  Extractor.prototype.blocks = function() {
    return this.blocks;
  }

  Extractor.prototype.extract = function() {
    this.justAppendedBr = false;
    this.inBlockquote = false;

    this.document = new Document(this);

    for(const node of this.nodes) {
      this.document.break(Paragraph);
      this.process(node);
      this.document.break(Paragraph);
    }

    return this.document.getContent().trim();
  }

  Extractor.prototype.arrayify = function(input) {
    if(Array.isArray(input)) return input;
    else return [input];
  }

  Extractor.prototype.convertNode = function(input) {
    if(input instanceof HTMLElement) return input;
    else if(input instanceof Document) return input.documentElement;
    else if(input instanceof Window) return input.document.documentElement;
    else throw "input passed to Extractor not of valid type; must be an instance of HTMLElement, Document, or Window.";
  }

  Extractor.prototype.process = function(node) {
    const nodeName = node.nodeName.toLowerCase();

    if(this.SKIP_TAGS.includes(nodeName)) return;

    //Handle repeated brs by making a paragraph break
    if(nodeName == "br") {
      if(this.justAppendedBr) {
        this.justAppendedBr = false;

        this.document.break(Paragraph);

        return;
      }
      else {
        this.justAppendedBr = true;
      }
    }
    else if(this.justAppendedBr) {
      this.justAppendedBr = false;

      this.document.push("\n");
    }

    if(node.nodeType == Node.TEXT_NODE) {
      if(Utils.isPresent(node.textContent)) this.document.push(new Span(node.textContent));

      return;
    }

    if(this.ENHANCERS[nodeName]) {
      this.document.push(new Span(this.ENHANCERS[nodeName]));
      this.processChildren(node);
      this.document.push(new Span(this.ENHANCERS[nodeName]));

      return;
    }

    if(nodeName == "blockquote") {
      this.inBlockquote = true;

      this.document.break(Paragraph);
      this.processChildren(node);
      this.document.break(Paragraph);

      this.inBlockquote = false;

      return;
    }

    if(nodeName == "li") {
      let index = null;
      if(node.parentNode.nodeName.toLowerCase() == "ol") {
        index = 1;
        let sibling = node;
        while((sibling = sibling.previousElementSibling)) index++;
      }

      this.document.break(ListItem, node.nextElementSibling == null, index);
      this.processChildren(node);
      this.document.break(Paragraph);

      return;
    }

    if(nodeName == "dt") {
      this.document.break(DefinitionTerm);
      this.processChildren(node);
      this.document.break(Paragraph);

      return;
    }

    if(nodeName == "dd") {
      this.document.break(DefinitionDescription, node.nextElementSibling == null);
      this.processChildren(node);
      this.document.break(Paragraph);

      return;
    }

    if(nodeName == "textarea") {
      this.document.break(Paragraph);
      if(Utils.isPresent(node.value)) this.document.push(new FixedSpan(node.value));
      this.document.break(Paragraph);

      return;
    }

    //These tags terminate the current paragraph, if present, and start a new paragraph
    if(this.BLOCK_INITIATING_TAGS.includes(nodeName)) {
      this.document.break(Paragraph);
      this.processChildren(node);
      this.document.break(Paragraph);

      return;
    }

    if(this.HEADING_TAGS.includes(nodeName)) {
      this.document.break(Heading, parseInt(nodeName[1]));
      this.processChildren(node);
      this.document.break(Paragraph);

      return;
    }

    //Pretend that the children of this node were siblings of this node (move them one level up the tree)
    this.processChildren(node);
  }

  Extractor.prototype.processChildren = function(node) {
    for(const child of node.childNodes) this.process(child);
  }

  Extractor.prototype.isInBlockquote = function() {
    return this.inBlockquote;
  }

  window.deba = function(input) {
    return (new Extractor(input)).extract();
  };
})(window);