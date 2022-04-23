import {
  Link
} from "/build/_shared/chunk-C4M7CSMF.js";
import {
  React,
  init_react
} from "/build/_shared/chunk-IYRIQ6PI.js";

// browser-route-module:/Users/pj/Work/Code/lunch-web/app/routes/index.tsx?browser
init_react();

// app/routes/index.tsx
init_react();
var pages = ["random", "list", "map"];
function Index() {
  return /* @__PURE__ */ React.createElement("div", {
    style: { fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }
  }, /* @__PURE__ */ React.createElement("h1", null, "Where to have lunch?"), pages.map((page) => /* @__PURE__ */ React.createElement(Link, {
    key: page,
    to: page
  }, page.toUpperCase())));
}
export {
  Index as default
};
//# sourceMappingURL=/build/routes/index-JZEVJEQ5.js.map
