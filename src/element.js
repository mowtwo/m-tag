function element(el, attrs = {}, c = () => []) {
  const options = {
    className: [],
    ...attrs,
  };

  const $ = ($c = c) => {
    c = $c;
    return proxyTarget;
  };

  const target = {
    $: new Proxy($, {
      get(_, prop) {
        return proxyTarget[prop];
      },
      apply(_, __, args) {
        return $.apply(null, args);
      },
    }),
    $$() {
      if (
        typeof c === "string" ||
        typeof c === "number" ||
        typeof c === "boolean"
      ) {
        const t = c;
        try {
          c = () => [t];
        } catch {
          c = () => [""];
        }
      }
      if (typeof c === "function" && !Array.isArray(c())) {
        const t = c();
        try {
          c = () => [t];
        } catch {
          c = () => [""];
        }
      }
      return {
        el,
        attrs: {
          ...options,
        },
        children: c().map((i) => {
          if (typeof i === "string") {
            return i;
          } else if (typeof i.$$ === "function") {
            return i.$$();
          } else {
            return "";
          }
        }),
      };
    },
  };

  const proxyTarget = new Proxy(target, {
    get(_, prop) {
      prop = String(prop);
      if (prop in target) {
        return target[prop];
      } else if (prop.indexOf("#") === 0) {
        options.id = prop.replace("#", "");
        return target["$"];
      } else {
        options.className.push(prop);
        return target["$"];
      }
    },
  });

  return proxyTarget;
}

function buildToTarget(fn) {
  let options = { className: [] };
  function tfn(...args) {
    const attrs = args[0] ?? {};
    attrs.className = [...options.className, ...(attrs.className ?? [])];
    if (options.id) {
      attrs.id = options.id;
    }
    options = { className: [] };
    return fn(attrs, ...args.slice(1));
  }
  return new Proxy(tfn, {
    get(_, prop) {
      if (prop === "$" || prop === "$$") {
        return tfn()[prop];
      } else if (prop.indexOf("#") === 0) {
        options.id = prop.replace("#", "");
        return tfn()["$"];
      } else {
        options.className.push(prop);
        return tfn()["$"];
      }
    },
  });
}

function div(attrs = {}, c = () => []) {
  return element("div", attrs, c);
}

function span(attrs = {}, c = () => []) {
  return element("span", attrs, c);
}

function br() {
  const el = element("br");
  return {
    $$: el.$$,
  };
}

module.exports = {
  element,
  div: buildToTarget(div),
  span: buildToTarget(span),
  br: buildToTarget(br),
};
