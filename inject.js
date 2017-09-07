function saveResult(result) {
  var blob = new Blob([result.text], { type: "text/plain;charset=utf-8" });
  var filename = result.title + ".txt";
  saveAs(blob, filename, true);
}

document.body.addEventListener("click", function(event) {
  if(!event.altKey) return;

  saveResult(denkiDeba(event.target));
});