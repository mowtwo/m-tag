const single = ["br"];

function astRender(ast) {
  const { id, className = [], ...otherAttrs } = ast?.attrs ?? {};
  const children = ast?.children ?? [];
  let html = `<${ast?.el}`;
  if (id) {
    html += ` id="${id}"`;
  }
  if (className.length > 0) {
    html += ` class="${className.join(" ")}"`;
  }
  for (const key in otherAttrs) {
    html += ` ${key}="${otherAttrs[key]}"`;
  }

  if (single.includes(ast?.el)) {
    html += " />";
    return html;
  }
  html += ">";
  for (const child of children) {
    if (typeof child === "string") {
      html += child;
      continue;
    }
    html += astRender(child);
  }
  html += `</${ast?.el}>`;
  return html;
}

function transfer(el) {
  const ast = el.$$();
  return astRender(ast);
}

module.exports = {
  transfer,
};
