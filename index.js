(() => {
  // src/utils/html-template-tag-async.ts
  const chars = {
    "&": "&amp;",
    ">": "&gt;",
    "<": "&lt;",
    '"': "&quot;",
    "'": "&#39;",
    "`": "&#96;"
  };
  const re = new RegExp(Object.keys(chars).join("|"), "g");
  const htmlEscape = (str = "") => String(str).replace(re, (match) => chars[match]);
  function* htmlGenerator(literals, ...subs) {
    var length = literals.raw.length, s = "", escape = true;
    for (var i = 0; i < length; i++) {
      let lit = literals.raw[i];
      let sub = subs[i - 1];
      if (sub) {
        if (Array.isArray(sub)) {
          for (s of sub)
            if (s)
              yield s;
        } else
          yield escape ? sub : {e: sub};
      }
      lit = (escape = lit.endsWith("$")) ? lit.slice(0, -1) : lit;
      if (lit)
        yield lit;
    }
  }
  const catchError = (x) => x.catch((x2) => `!!!!Error!!!! ${x2}`);
  async function runCallback(callback, val) {
    var e;
    if (val instanceof Promise)
      val = await val;
    if (val?.e instanceof Promise)
      e = await val.e;
    if (!e && val?.e)
      e = val.e;
    if (val?.start || e?.start && (val = e)) {
      await catchError(val.start(callback));
    } else if (Array.isArray(val) || Array.isArray(e) && (val = e)) {
      for (const x of val)
        await runCallback(callback, x);
    } else if (e) {
      await callback(htmlEscape(e));
    } else
      await callback(val);
  }
  class HTMLRunner_ {
    constructor(generator) {
      this.g = generator;
    }
    async start(callback) {
      var val;
      while ((val = this.g.next()) && !val.done) {
        await runCallback(callback, val.value);
      }
    }
  }
  var html_template_tag_async_default = (literals, ...subs) => new HTMLRunner_(htmlGenerator(literals, ...subs));

  // src/app/index.ts
  var app_default = html_template_tag_async_default`<h1 style="background-color:black;color:green;">Green!</h1>`;

  // src/index.ts
  addEventListener("fetch", fetchHandler);
  function fetchHandler(e) {
    e.respondWith(handleRequest(e.request));
  }
  async function handleRequest(_) {
    return streamResponse(app_default);
  }
  const encoder = new TextEncoder();
  async function streamResponse(html) {
    let {readable, writable} = new TransformStream();
    const writer = writable.getWriter();
    const send = (item) => writer.write(encoder.encode(item));
    html.start(send).then(async () => await writer.close());
    return new Response(readable, {headers: {"content-type": "text/html; charset=utf-8"}});
  }
})();
