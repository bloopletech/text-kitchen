var matchers = null;

function ensureMatchers(callback) {
  if(matchers != null) {
    callback();
    return;
  }

  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if(request.readyState == XMLHttpRequest.DONE && request.status == 200) {
      matchers = JSON.parse(request.responseText);

      callback();
    }
  };
  request.open('GET', chrome.runtime.getURL('matchers.json'));
  request.send();
}

function matcherFor(element) {
  for(const matcher of matchers) {
    var matchedElement = element.closest(matcher.finder);
    if(matchedElement) return [matchedElement, matcher];
  }
}

function executeMatcher([element, matcher]) {
  var nodes = [];
  for(const s of matcher.selectors) {
    if(s == ":root") nodes.push(element);
    else nodes = nodes.concat(Array.from(element.querySelectorAll(s)));
  }

  var title = "";
  if(matcher.pageTitle) title = document.title;
  else {
    var titles = [];
    for(const e of element.querySelectorAll(matcher.title)) titles.push(e.innerText);
    title = titles.join(" ");
  }

  return {
    text: deba(nodes),
    title: title
  };
}

function saveResult(result) {
  var blob = new Blob([result.text], { type: "text/plain;charset=utf-8" });
  var filename = result.title + ".txt";
  saveAs(blob, filename, true);
}

document.body.addEventListener("click", function(event) {
  if(!event.altKey) return;

  ensureMatchers(function() {
    saveResult(executeMatcher(matcherFor(event.target)));
  });
});