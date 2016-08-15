function isMatch(node) {
  if(node.matches("div.alt2, div.postcontent, p.message")) return true;
  return false;
}

function notifyUser() {
  var alert = document.createElement("div");
  alert.innerHTML = '<div style="box-sixing: border-box; position: fixed; top: 20px; right: 20px; z-index: 9999999; padding: 15px; border: 1px solid #d6e9c6; border-radius: 4px; color: #3c763d; background-color: #dff0d8; font-weight: normal; font-size: 14px; font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;">Selection copied ✓</div>';
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
    if(isMatch(target)) {
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