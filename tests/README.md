# Validator tests

Unit tests for the serverless validation handlers in `server/api 2/validate/`
(and the injectable `server/api 2/sql.js`). They assert that every lab is solved
by **real extracted evidence**, not self-reported flags.

## Run (macOS, no install needed)

From the repo root:

```bash
./tests/run.sh
```

This uses the `jsc` (JavaScriptCore) binary that ships with macOS to load each
handler through a small CommonJS + mock req/res shim and check its behavior.

## Run with Node (any platform)

The handlers are plain CommonJS, so you can also exercise them with `vercel dev`
and `curl`, or adapt `tests/validators.spec.js` to your preferred runner.
