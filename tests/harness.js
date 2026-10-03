// CommonJS + mock req/res harness for jsc (no Node).
// Usage: load this, then callHandler(relPathFromApiDir, {query, body, method}) -> {status, headers, json, text}
var ROOT = ".";  // run from repo root
var API = ROOT + "/server/api 2";

// globals the handlers expect from Node (attach to globalThis so new Function() sees them)
globalThis.process = { cwd: function(){ return ROOT; }, env: {} };
globalThis.Buffer = { from: function(s){ return { toString: function(){ return s; } }; } };

function dirname(p){ return p.slice(0, p.lastIndexOf("/")); }
function normalize(p){
  var parts = p.split("/"), out = [];
  for (var i=0;i<parts.length;i++){
    var s = parts[i];
    if (s === "" && out.length) continue;
    if (s === ".") continue;
    if (s === ".."){ out.pop(); continue; }
    out.push(s);
  }
  return out.join("/");
}

// fake data store for fs stub
var FS_FILES = {};
FS_FILES[ROOT + "/data/orders.json"] = read(ROOT + "/data/orders.json");

function fsStub(){
  return {
    readFileSync: function(p){ if (FS_FILES[p] != null) return FS_FILES[p]; return read(p); },
    writeFileSync: function(){},
    existsSync: function(p){ return FS_FILES[p] != null; }
  };
}
function pathStub(){
  return { join: function(){ return Array.prototype.join.call(arguments, "/").replace(/\/+/g,"/"); } };
}
function urlStub(){
  return { URL: function(u){ // minimal: parse query
    this.searchParams = { entries: function(){ return []; } };
  }};
}

var cache = {};
function requireFrom(baseDir){
  return function(id){
    if (id === "fs") return fsStub();
    if (id === "path") return pathStub();
    if (id === "url") return urlStub();
    if (id === "crypto") return { createHash: function(){ return { update:function(){return this;}, digest:function(){return "deadbeef";} }; } };
    // relative
    var p = normalize(baseDir + "/" + id);
    var candidates = [p, p + ".js", p + "/index.js"];
    for (var i=0;i<candidates.length;i++){
      var c = candidates[i];
      if (cache[c]) return cache[c].exports;
      var src = tryRead(c);
      if (src != null){
        var mod = { exports: {} };
        cache[c] = mod;
        var fn = new Function("module","exports","require","__dirname","__filename", src);
        fn(mod, mod.exports, requireFrom(dirname(c)), dirname(c), c);
        return mod.exports;
      }
    }
    throw new Error("Cannot resolve: " + id + " from " + baseDir);
  };
}

function tryRead(p){ try { return read(p); } catch(e){ return null; } }

function loadHandler(rel){
  cache = {}; // fresh module state each call (reset in-memory attempt counters)
  var file = API + "/" + rel + ".js";
  var src = read(file);
  var mod = { exports: {} };
  var fn = new Function("module","exports","require","__dirname","__filename", src);
  fn(mod, mod.exports, requireFrom(dirname(file)), dirname(file), file);
  return mod.exports;
}

function makeReqRes(opts){
  opts = opts || {};
  var body = opts.body != null ? (typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body)) : "";
  var req = {
    method: opts.method || "GET",
    url: "/api/x",
    query: opts.query || {},
    headers: opts.headers || {},
    _handlers: {},
    on: function(ev, cb){ this._handlers[ev] = cb; return this; }
  };
  // drive readBody: when 'end' registered, fire data+end synchronously
  var origOn = req.on;
  req.on = function(ev, cb){
    this._handlers[ev] = cb;
    if (ev === "end"){
      if (this._handlers.data && body) this._handlers.data(body);
      cb();
    }
    return this;
  };
  var res = {
    statusCode: 200,
    _headers: {},
    _body: "",
    setHeader: function(k,v){ this._headers[k.toLowerCase()] = v; },
    end: function(s){ if (s != null) this._body = String(s); this._ended = true; }
  };
  return { req: req, res: res };
}

function callHandler(rel, opts){
  var h = loadHandler(rel);
  var rr = makeReqRes(opts);
  var out = h(rr.req, rr.res);
  if (typeof drainMicrotasks === "function") drainMicrotasks();
  function finish(){
    var text = rr.res._body, json = null;
    try { json = JSON.parse(text); } catch(e){}
    return { status: rr.res.statusCode, headers: rr.res._headers, text: text, json: json };
  }
  // handlers are sync in our harness (await resolves synchronously since readBody fires sync)
  return finish();
}

// tiny assert
var FAILED = 0, PASSED = 0;
function eq(actual, expected, msg){
  var a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a === e){ PASSED++; }
  else { FAILED++; print("FAIL: " + msg + "\n   expected " + e + "\n   got      " + a); }
}
function ok(cond, msg){ if (cond){ PASSED++; } else { FAILED++; print("FAIL: " + msg); } }
function summary(){ print("\n" + PASSED + " passed, " + FAILED + " failed"); if (FAILED) throw new Error("tests failed"); }
