function compileMatchSelector() {
  var selectors = [];

  selectors.push("textarea"); //Form textearas
  selectors.push("div.alt2"); //Contents of spoiler sections on some vBulletin forum posts
  selectors.push("div.postcontent"); //vBulletin forum posts
  selectors.push("p.message"); //kusaba-based imageboard posts
  selectors.push("div.entry-content"); //blogspot.com blog posts
  selectors.push("div.boxbody"); //?
  selectors.push("div.entry-inner"); //Some wordpress blog posts
  selectors.push("div#selectable"); //pastebin.com content
  selectors.push("div.usertext-body"); //reddit.com posts
  selectors.push("blockquote.postMessage"); //futaba-based imageboard posts
  selectors.push("div.grf-indent"); //Deviant Art text posts
  selectors.push("div.story-contents"); //Certain author site

  return selectors.join(", ");
}

var matchSelector = compileMatchSelector();
var fallbackMatchSelector = "div, pre, blockquote";

function findElement(element, selector) {
  while(element && element != document) {
    if(element.matches(selector)) return element;
    element = element.parentNode;
  }

  return null;
}

var alertStyles = `
  box-sixing: border-box;
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000001;
  padding: 15px;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  font-weight: normal;
  font-size: 14px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  box-shadow: 4px 4px 6px 0px rgba(0,0,0,0.4);
`;

var successAlertStyles = `
  border-color: #d6e9c6;
  color: #3c763d;
  background-color: #dff0d8;
`;

var errorAlertStyles = `
  border-color: #ebccd1;
  color: #a94442;
  background-color: #f2dede;
`;

var textareaStyles = `
  position: absolute;
  left: -9999px;
  top: -9999px;
  width: 100px;
  height: 100px;
`;

var successAlertElement = `<div style="${(alertStyles + successAlertStyles).replace(/\s+/g, " ")}">Selection copied ✓</div>`;
var errorAlertElement = `<div style="${(alertStyles + errorAlertStyles)}">Could not find selection to copy</div>`;

function alertUser(content) {
  var alert = document.createElement("div");
  alert.innerHTML = content;
  document.body.appendChild(alert);

  setTimeout(function() {
    alert.remove()
  }, 4000);
}

function selectCopy(text) {
  var textarea = document.createElement("textarea");
  textarea.style.cssText = textareaStyles.replace(/\s+/g, " ");
  textarea.textContent = text;

  document.body.appendChild(textarea);

  textarea.select();
  document.execCommand("copy");

  textarea.remove();
}

document.body.addEventListener("click", function(event) {
  if(!event.altKey) return;

  var match = findElement(event.target, matchSelector) || findElement(event.target, fallbackMatchSelector);
  if(!match) {
    alertUser(errorAlertElement);
    return;
  }

  selectCopy(deba(match));

  alertUser(successAlertElement);
});