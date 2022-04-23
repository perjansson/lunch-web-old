import {
  Link
} from "/build/_shared/chunk-IC556AE3.js";
import {
  Center,
  checkIsCSSLength,
  getSafeGutter,
  spacing,
  styled_components_browser_esm_default,
  validateGutter
} from "/build/_shared/chunk-LAL5LKA2.js";
import {
  React,
  init_react
} from "/build/_shared/chunk-IYRIQ6PI.js";

// browser-route-module:/Users/pj/Work/Code/lunch-web/app/routes/index.tsx?browser
init_react();

// app/routes/index.tsx
init_react();

// node_modules/@bedrock-layout/padbox/lib/index.m.js
init_react();
var propTypes = { exports: {} };
var ReactPropTypesSecret$1 = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;
var ReactPropTypesSecret = ReactPropTypesSecret_1;
function emptyFunction() {
}
function emptyFunctionWithReset() {
}
emptyFunctionWithReset.resetWarningCache = emptyFunction;
var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      return;
    }
    var err = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
    err.name = "Invariant Violation";
    throw err;
  }
  shim.isRequired = shim;
  function getShim() {
    return shim;
  }
  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,
    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,
    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };
  ReactPropTypes.PropTypes = ReactPropTypes;
  return ReactPropTypes;
};
{
  propTypes.exports = factoryWithThrowingShims();
}
var PropTypes = propTypes.exports;
var validKeys = /* @__PURE__ */ new Set([
  "left",
  "right",
  "top",
  "bottom",
  "inlineStart",
  "inlineEnd",
  "blockStart",
  "blockEnd"
]);
var keyToProperty = (key, val) => {
  const modernMap = {
    left: `padding-inline-start:${val};`,
    right: `padding-inline-end:${val};`,
    top: `padding-block-start:${val};`,
    bottom: `padding-block-end:${val};`,
    inlineStart: `padding-inline-start:${val};`,
    inlineEnd: `padding-inline-end:${val};`,
    blockStart: `padding-block-start:${val};`,
    blockEnd: `padding-block-end:${val};`
  };
  return modernMap[key];
};
var paddingToString = (theme, padding) => {
  var _a;
  if (Array.isArray(padding) && padding.length > 4) {
    throw new Error("padding arrays can only be 4 or less in length");
  }
  const validSpacings = new Set(Object.keys((_a = theme.spacing) != null ? _a : spacing));
  const isValidPadding = () => {
    if (typeof padding === "number" || typeof padding === "string") {
      return padding > 0 || validSpacings.has(padding.toString()) || checkIsCSSLength(padding.toString());
    }
    if (Array.isArray(padding)) {
      return padding.every((val) => {
        return val > 0 || validSpacings.has(val.toString()) || checkIsCSSLength(val.toString());
      });
    }
    return padding !== void 0 && Object.keys(padding).every((key) => validKeys.has(key)) && Object.values(padding).every((val) => {
      return val > 0 || validSpacings.has(val.toString()) || checkIsCSSLength(val.toString());
    });
  };
  if (!isValidPadding()) {
    console.error("Invalid padding Type");
  }
  return typeof padding === "object" && !Array.isArray(padding) ? Object.entries(padding).reduce((acc, [key, val]) => {
    var _a2;
    return acc + keyToProperty(key, (_a2 = getSafeGutter(theme, val)) != null ? _a2 : "0px");
  }, "") : `padding: ${Array.from(Array.isArray(padding) ? padding : [padding]).map((pad) => {
    var _a2;
    return (_a2 = getSafeGutter(theme, pad)) != null ? _a2 : "0px";
  }).join(" ")};`;
};
var PadBox = styled_components_browser_esm_default.div.attrs(() => ({
  "data-bedrock-padbox": ""
}))`
  box-sizing: border-box;
  ${(props) => props.padding !== void 0 ? paddingToString(props.theme, props.padding) : ""}
`;
PadBox.displayName = "PadBox";
PadBox.propTypes = {
  padding: PropTypes.oneOfType([
    validateGutter,
    PropTypes.objectOf(validateGutter),
    PropTypes.arrayOf(validateGutter)
  ]).isRequired
};

// node_modules/@bedrock-layout/reel/lib/index.m.js
init_react();
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var propTypes2 = { exports: {} };
var ReactPropTypesSecret$12 = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
var ReactPropTypesSecret_12 = ReactPropTypesSecret$12;
var ReactPropTypesSecret2 = ReactPropTypesSecret_12;
function emptyFunction2() {
}
function emptyFunctionWithReset2() {
}
emptyFunctionWithReset2.resetWarningCache = emptyFunction2;
var factoryWithThrowingShims2 = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret2) {
      return;
    }
    var err = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
    err.name = "Invariant Violation";
    throw err;
  }
  shim.isRequired = shim;
  function getShim() {
    return shim;
  }
  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,
    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,
    checkPropTypes: emptyFunctionWithReset2,
    resetWarningCache: emptyFunction2
  };
  ReactPropTypes.PropTypes = ReactPropTypes;
  return ReactPropTypes;
};
{
  propTypes2.exports = factoryWithThrowingShims2();
}
var PropTypes2 = propTypes2.exports;
var Reel = styled_components_browser_esm_default.div.attrs((props) => {
  const maybeGutter = getSafeGutter(props.theme, props.gutter);
  return {
    "data-bedrock-reel": props.snapType ? `snapType:${props.snapType}` : "",
    style: __spreadProps(__spreadValues({}, props.style), { "--gutter": maybeGutter })
  };
})`
  box-sizing: border-box;
  > * {
    margin: 0;
    scroll-snap-align: start;
  }

  display: flex;
  gap: var(--gutter, 0px);

  overflow-x: scroll;

  scroll-snap-type: ${({ snapType = "none" }) => {
  switch (snapType) {
    case "none": {
      return "none";
    }
    case "proximity": {
      return "x proximity";
    }
    case "mandatory": {
      return "x mandatory";
    }
    default: {
      return "none";
    }
  }
}};
`;
Reel.displayName = "Reel";
Reel.propTypes = {
  snapType: PropTypes2.oneOf(["none", "proximity", "mandatory"]),
  gutter: validateGutter
};

// app/routes/index.tsx
var pages = ["random", "list", "map"];
function Index() {
  return /* @__PURE__ */ React.createElement("div", {
    style: { fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }
  }, /* @__PURE__ */ React.createElement(Center, {
    maxWidth: "90%"
  }, /* @__PURE__ */ React.createElement("h1", {
    style: { textAlign: "center" }
  }, "Where to have lunch?"), /* @__PURE__ */ React.createElement(Reel, {
    snapType: "none",
    gutter: "lg"
  }, pages.map((page) => /* @__PURE__ */ React.createElement(PadBox, {
    key: page,
    style: {
      border: "1px solid black"
    },
    padding: "10%"
  }, /* @__PURE__ */ React.createElement(Link, {
    to: page
  }, capitalizeFirstLetter(page)))))));
}
function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
export {
  Index as default
};
//# sourceMappingURL=/build/routes/index-KJDVUYLI.js.map
