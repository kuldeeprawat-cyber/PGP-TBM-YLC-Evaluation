import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

/**
 * IMPORTANT — read this before relying on this in production.
 *
 * The app was originally built to run inside Claude.ai's sandbox, which provides a
 * `window.storage` API (get/set/delete/list) for persisting evaluator decisions.
 * That API does not exist in a normal browser, so this file polyfills it with
 * localStorage so the app runs standalone without crashing.
 *
 * THE CATCH: localStorage is per-browser, per-device. It is NOT shared across
 * different computers or browsers. That means:
 *   - Evaluations Shivas saves on his laptop will NOT be visible to Pratham on his laptop.
 *   - The "Pratham only sees candidates Shivas advanced" queue logic will not work
 *     correctly across separate machines, because each machine has its own local copy.
 *
 * This polyfill is fine for local testing / a single-person demo on one machine.
 * For real multi-evaluator use (Kuldeep, Shivas, and Pratham on separate devices,
 * seeing the same shared evaluation data), this needs to be swapped for a real
 * backend — e.g. a small API backed by Postgres/Supabase/Firebase. Ask Claude to
 * help wire that up when you're ready; the rest of the app's logic won't need to change,
 * only these storage calls.
 */
function makeKey(key, shared) {
  return `mu-storage:${shared ? "shared" : "user"}:${key}`;
}

window.storage = {
  async get(key, shared = false) {
    const raw = localStorage.getItem(makeKey(key, shared));
    if (raw === null) throw new Error(`Key not found: ${key}`);
    return { key, value: raw, shared };
  },
  async set(key, value, shared = false) {
    localStorage.setItem(makeKey(key, shared), value);
    return { key, value, shared };
  },
  async delete(key, shared = false) {
    const existed = localStorage.getItem(makeKey(key, shared)) !== null;
    localStorage.removeItem(makeKey(key, shared));
    return { key, deleted: existed, shared };
  },
  async list(prefix = "", shared = false) {
    const scope = `mu-storage:${shared ? "shared" : "user"}:`;
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(scope)) {
        const realKey = k.slice(scope.length);
        if (!prefix || realKey.startsWith(prefix)) keys.push(realKey);
      }
    }
    return { keys, prefix, shared };
  },
};

console.warn(
  "[Masters' Union app] Using a localStorage polyfill for window.storage. " +
  "Evaluations will NOT sync across different browsers/devices until this is replaced with a real backend."
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
