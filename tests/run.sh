#!/usr/bin/env bash
# Run validator unit tests with macOS JavaScriptCore. Execute from the repo root.
set -euo pipefail
JSC="/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc"
if [ ! -x "$JSC" ]; then
  echo "jsc not found at $JSC (macOS only). On other platforms, test via 'vercel dev' + curl." >&2
  exit 1
fi
cd "$(dirname "$0")/.."
"$JSC" tests/harness.js tests/validators.spec.js
