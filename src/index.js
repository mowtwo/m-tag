const { div, span, br } = require("./element");
const { transfer } = require("./transfer");

const el = div({ className: ["qt"] }).top(() => [
  div['#myLine'].line.dot("dot-line"),
  div.list(() =>
    [1, 2, 3].map((num) =>
      span({ className: ["qt-list-item"] }, num.toString())
    )
  ),
  div.dot(() => span.tip("tip")),
  br,
]);

// const logJSON = (obj) => console.log(JSON.stringify(obj, null, " "));

console.log(transfer(el));
