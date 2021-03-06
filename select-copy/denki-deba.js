var deba = (typeof require === 'function') ? require('deba') : deba;

var denkiDeba = (function() {
  var matchers = [
    {
      "finder": "#super_frame > #monster_frame > #content_frame",
      "selectors": [".paste_box_frame .paste_box_line1 h1", "textarea.paste_code"],
      "title": ".paste_box_frame .paste_box_line1 h1",
      "comment": "pastebin.com content"
    },
    {
      "finder": "html[b\\:version=\"2\"] div.post",
      "selectors": ["h3.post-title.entry-title", "div.entry-content"],
      "title": "h3.post-title.entry-title",
      "comment": "blogspot blog posts"
    },
    {
      "finder": "div#siteTable > div.thing",
      "selectors": [".top-matter > p.title > a.title", ".top-matter > p.tagline", "form.usertext div.usertext-body"],
      "title": ".top-matter > p.title > a.title, .top-matter > p.tagline > span.author",
      "comment": "reddit.com text posts"
    },
    {
      "finder": "div.sitetable div.thing.comment",
      "selectors": [":scope > div.entry > p.tagline > a.author", ":scope > div.entry > form.usertext > div.usertext-body"],
      "title": ":scope > div.entry > p.tagline > a.author",
      "comment": "reddit.com comment"
    },
    {
      "finder": "form#delform > div.board div.postContainer",
      "selectors": [".postInfo span.nameBlock", "blockquote.postMessage"],
      "title": ".postInfo span.nameBlock",
      "comment": "futaba-based imageboard posts"
    },
    {
      "finder": "div.post",
      "selectors": [".post_header .subject", ".post_header .postername", "p.message"],
      "title": ".post_header .subject, .post_header .postername",
      "comment": "kusaba-based imageboard posts"
    },
    {
      "finder": "body.deviantart",
      "selectors": [".gr > .metadata", ".gr-body > .gr > .grf-indent"],
      "title": ".gr > .metadata h2",
      "comment": "Deviant Art text posts"
    },
    {
      "finder": "textarea",
      "selectors": [":root"],
      "title": "",
      "pageTitle": true,
      "comment": "generic textarea content"
    },
    {
      "finder": "html",
      "selectors": ["body"],
      "title": "h1:first-of-type",
      "comment": "generic content"
    }
  ];

  function matcherFor(element) {
    for(const matcher of matchers) {
      const matchedElement = element.closest ? element.closest(matcher.finder) : element.querySelector(matcher.finder);
      if(matchedElement) return [matchedElement, matcher];
    }
  }

  function executeMatcher([element, matcher]) {
    let nodes = [];
    for(const s of matcher.selectors) {
      if(s == ":root") nodes.push(element);
      else nodes = nodes.concat(Array.from(element.querySelectorAll(s)));
    }

    const titles = [];
    for(const e of element.querySelectorAll(matcher.title)) titles.push(e.innerText);
    const title = titles.join(" ");

    return {
      text: deba(nodes),
      title: title
    };
  }

  return function(element) {
    return executeMatcher(matcherFor(element));
  };
})();

if(typeof module === "object" && typeof module.exports === "object") module.exports = denkiDeba;