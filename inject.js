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
  while(element && element != document) {
    for(const matcher of matchers) {
      if(element.matches(matcher.finder)) return matcher;
    }

    element = element.parentNode;
  }

  return null;
}

function executeMatcher(matcher) {
  var nodes = matcher.selectors.map(function(selector) {
    return document.querySelector(selector);
  });

  var title = document.querySelector(matcher.title).innerText;

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