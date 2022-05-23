const { div, span, br } = require("./element");
const { transfer } = require("./transfer");
const pretty = require("pretty");

const el = div({ className: ["qt"] }).top(() => [
  div["#myLine"].line.dot("dot-line"),
  div.list(() =>
    [1, 2, 3].map((num) =>
      span({ className: ["qt-list-item"] }, num.toString())
    )
  ),
  div.dot(() => span.tip("tip")),
  br,
]);

const html = transfer(el);

console.log(
  pretty(html, {
    ocd: true,
  })
);
