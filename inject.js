function parseHeading(text, container) {
  var parts = text.match(/^(#+) (.*)$/);

  var heading = document.createElement("h" + parts[1].length);
  heading.textContent = parts[2];

  container.appendChild(heading);
}

function parseParagraph(text, container) {
  var paragraph = document.createElement("p");
  paragraph.textContent = text;

  container.appendChild(paragraph);
}

function parseText(text, container) {
  var nodes = text.split(/\n{2,}/g);

  for(let node of nodes) {
    if(node.startsWith("#")) parseHeading(node, container);
    else parseParagraph(node, container);
  }
}

function renderStory(text) {
  var container = document.createElement("div");
  container.setAttribute("id", "story-container");

  parseText(text, container);

  document.body.appendChild(container);

  var firstHeading = document.querySelector("h1, h2, h3, h4, h5, h6");
  document.title = firstHeading.textContent;
}

function process() {
  var pre = document.querySelector("pre");
  var text = pre.innerText;
  pre.remove();

  setTimeout(renderStory.bind(null, text), 1);
}

process();

