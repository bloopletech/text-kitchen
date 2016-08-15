function isMatch(node) {
  if(node.classList.contains("alt2")) return true;
  if(node.classList.contains("postcontent")) return true;
  return false;
}

document.body.addEventListener("click", function(event) {
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
});