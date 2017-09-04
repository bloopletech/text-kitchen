const deba = require("./deba.js");

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

JSDOM.fromFile(process.argv[2]).then(dom => {
  console.log(deba.deba(dom.window.document));
});

