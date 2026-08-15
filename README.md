# Masters' Union — C8 Profile Evaluation Platform

## Why the previous upload failed with 404
The file you uploaded before (`app.jsx`) was a single React component, not a
website. Vercel had no `package.json`, no build tool, and no `index.html` to
serve — so there was nothing to actually deploy, hence NOT_FOUND.

This folder is a complete, real project: Vite + React, with the app's actual
code unchanged inside `src/App.jsx`.

## Deploy to Vercel

1. Create a new GitHub repository and push **the entire contents of this folder**
   (not just `App.jsx`) — including `package.json`, `vite.config.js`, `index.html`,
   and the `src/` folder.
2. In Vercel: **Add New → Project → Import** your repo.
3. Vercel will auto-detect the **Vite** framework preset. Leave build command as
   `npm run build` and output directory as `dist` (Vercel usually fills these in
   automatically).
4. Deploy.

## Run it locally first (recommended)
```
npm install
npm run dev
```
Then open the local URL it prints.

## Important limitation — read before rolling this out to Shivas/Pratham/Kuldeep

This app was built to run inside Claude.ai's sandbox, which has a built-in
`window.storage` API for saving evaluator decisions. That API doesn't exist in
a normal browser, so `src/main.jsx` includes a **localStorage polyfill** so the
app runs without crashing.

**localStorage only lives in one browser on one device.** That means:
- If Shivas evaluates candidates on his laptop, Pratham will **not** see those
  evaluations on his own laptop — each device has its own separate copy.
- The core rule ("Pratham only sees candidates Shivas advanced, never his
  rejects") will only work correctly if everyone is using the *same browser on
  the same device*, which isn't realistic for three separate evaluators.

This is fine for local testing or a single-person demo. For real shared use
across Shivas, Pratham, and Kuldeep on their own devices, the storage layer
needs to be swapped for a real backend (e.g. a small API on top of Postgres,
Supabase, or Firebase). The rest of the app doesn't need to change — only the
four functions in `src/main.jsx` (`get`/`set`/`delete`/`list`) need to talk to
a real database instead of localStorage. Ask Claude to help wire that up next.

## Also note
The "Generate Insights" button on the Analysis page calls the Anthropic API
directly, which only works inside Claude.ai's sandbox. Outside of it, that
button will show "Could not generate AI insights right now" instead of
crashing — everything else on the page still works normally.
