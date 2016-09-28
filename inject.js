function compileMatchSelector() {
  var selectors = [];
  
  selectors.push("textarea");
  selectors.push("div.alt2"); //Contents of spoiler sections on some vBulletin forum posts
  selectors.push("div.postcontent"); //vBulletin forum posts
  selectors.push("p.message"); //kusaba-based imageboard posts
  selectors.push("div.entry-content"); //?
  selectors.push("div.boxbody"); //?
  selectors.push("div.entry-inner"); //Some wordpress blogs
  selectors.push("div#selectable"); //pastebin.com content

  return selectors.join(", ");
}

var matchSelector = compileMatchSelector();

var notificationStyles = `
  box-sixing: border-box;
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999999;
  padding: 15px;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  color: #3c763d;
  background-color: #dff0d8;
  font-weight: normal;
  font-size: 14px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
`;

var notificationElement = `<div style="${notificationStyles.replace(/\s+/g, " ")}">Selection copied ✓</div>`;

function notifyUser() {
  var alert = document.createElement("div");
  alert.innerHTML = notificationElement;
  document.body.appendChild(alert);

  setTimeout(function() {
    alert.remove()
  }, 4000);
}

document.body.addEventListener("click", function(event) {
  if(!event.altKey) return;

  var target = event.target;
  var matched = false;
  while(target) {
    if(target.matches(matchSelector)) {
      matched = true;
      break;
    }
    target = target.parentNode;
  }

  if(!matched) return;

  var range = document.createRange();
  range.selectNode(target);

  var selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  document.execCommand("copy");

  selection.removeAllRanges();

  notifyUser();
});