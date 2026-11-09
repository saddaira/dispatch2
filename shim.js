(function () {
  if (window.parent === window) return;

  var parentOrigin = null; 
  var cache = {};            

  // datos iniciales
  window.addEventListener("message", function (e) {
    if (e.source !== window.parent) return;
    var m = e.data;
    if (!m || m.type !== "init") return;
    parentOrigin = e.origin;
    cache = m.values || {};
  });

  function send(action, key, value) {
    if (!parentOrigin) return;
    window.parent.postMessage(
      { type: "scorm", action: action, key: key, value: value },
      parentOrigin
    );
  }

  window.API = {
    LMSInitialize: function () { return "true"; },
    LMSGetValue: function (k) { return cache[k] !== undefined ? String(cache[k]) : ""; },
    LMSSetValue: function (k, v) { cache[k] = v; send("setValue", k, v); return "true"; },
    LMSCommit: function () { send("commit"); return "true"; },
    LMSFinish: function () { send("finish"); return "true"; },
    LMSGetLastError: function () { return "0"; },
    LMSGetErrorString: function () { return ""; },
    LMSGetDiagnostic: function () { return ""; }
  };

  window.parent.postMessage({ type: "ready" }, "*");
})();