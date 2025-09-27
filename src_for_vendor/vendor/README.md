This is the source for the css and js files for my deck.js presentations.

run the script `uglify_and_cleancss.sh` to build these.

(there is also an uglify script in deck.js: I am not sure what this is for)

---

Overview
- This repository contains the JavaScript and CSS that power HTML slide presentations built on top of deck.js, plus a handful of custom extensions and third‑party utilities.
- The code here is intended to be bundled/minified for use in slide decks. Source files (particularly under deck.js/) can be modified and then re-bundled using the script noted above.
- If you are new to deck.js or this stack, read deck.js/README.md for deep, module‑by‑module details of our customisations.

Repository layout (high‑level)
- deck.js/: Customised deck.js plugins and extensions (core, fit/scaling, events, step navigation, hash, menu, notes/export, remote control, clone utilities, velocity actions). See deck.js/README.md.
- twitter-bootstrap/js/: Bootstrap JS runtime used by some decks/pages.
- questionmark.js/: Question mark helper library (used by some decks to render quizzes/annotations).
- working-example/: Minimal example showing how the bundled assets are used (scripts/for.slides.all.min.js).
- Root JS utilities (selection):
  - jquery.min.js, modernizr.min.js, screenfull.js, velocity.min.js, jquery.jsPlumb-1.3.16-all-min.js
  - marked.min.js (Markdown), rough-notation.iife.js (annotations), circletype.js, rainyday.js
  - for.slides.all.min.js, for.frontpage.all.min.js (prebuilt bundles used by decks and non‑deck pages)

Build outputs and scripts
- Primary build entrypoint: uglify_and_cleancss.sh (root). Produces minified concatenations used by the presentations (e.g., for.slides.all.min.js and CSS counterparts).
- Deck‑specific bundle: deck.js may also have its own mini build script (uglify_and_clean_css_deck.sh) to produce deck.all.min.js / deck.all.min.css for internal testing. Prefer the root script for final outputs unless you know you need the deck‑local script.
- Tooling expectations: Node‑based CLI tools like uglify-js and clean-css-cli should be installed globally when running the scripts.

Development quick start
1) Make a change
- Edit source under deck.js/ (e.g., deck.init.js, deck.velocity.js) or update/replace third‑party libs at the root if needed.
2) Rebuild
- Run ./uglify_and_cleancss.sh to regenerate the minified bundles.
3) Test locally
- Open a deck that consumes the bundles (see working-example/), or load one of your presentation HTML files that includes the produced JS/CSS.
4) Iterate
- Use the browser console. deck.js exposes helpers via $.deck('...') (e.g., forceRefresh, getOptions) to aid debugging.

Authoring conventions used by this stack (slides)
- Slides are .slide elements inside a .deck-container. Nested slides are supported; navigation differentiates between step‑through (left/right) and top‑level jumps (up/down).
- Action helpers: Authoring tooling emits small .dv nodes (e.g., dv-velocity, dv-style, dv-addclass, dv-attr, dv-connect). These are parsed at runtime by deck.velocity.js into reversible actions that play/undo as you navigate.
- Notes/handout/export: deck.notes.js extracts elements with .notes, .handout, .transcript into side panels and into export views. Keep the expected container structure around .deck-container if you rely on notes/handout.
- Hash/menu/remote/clone: hash deep‑links, menu overview, remote controller, and mirrored windows are available and wired to keyboard shortcuts (see deck.js/README.md for keys and options).

Key dependencies at runtime
- jQuery (required), Velocity (for animations), jsPlumb (only when using dv-connect connectors), Modernizr (feature detection), and optional utilities (Screenfull, Rough Notation, etc.). Ensure these are loaded before the deck initialises.

Known limitations and assumptions
- jQuery‑centric, script order matters: This stack expects classic script tags in specific order; it is not an ES module build and does not use a modern bundler. Mixing module/nomodule can lead to race conditions.
- Deep coupling to DOM structure: Notes/export and dv‑action parsing assume specific class names and containers. Changing markup structure without updating the processors will break exports or leave stray elements.
- Undo paths are required for custom actions: If you add new dv‑style actions, make sure they implement undoit for backwards navigation.
- Performance on very large decks: Core tweaks improve performance, but extremely large or deeply nested decks can still stress the DOM; test transitions and menu view with big decks.
- Browser support: Target modern evergreen browsers. Legacy IE is not supported; mobile touch behaviour varies and is lightly tested.

Troubleshooting tips
- Animations do nothing: Verify Velocity is loaded before deck.velocity.js runs; check the console for registration of slide actions.
- Connectors misplace or jitter: dv-connect temporarily disables scaling while wiring; ensure elements have stable layout and that jsPlumb is present.
- Notes/handout panel empty: Confirm the required sibling containers exist and slides have .notes/.handout content without being marked .show (which keeps them on the slide only).
- Hash deep‑links not working: Ensure deck.hash.js is included and no conflicting history/router code is on the page.

Contributing workflow
- Keep changes modular: follow the existing $.deck('extend', ...) plugin style and listen to deck.init/deck.change events.
- Update docs: If you add new dv‑* action types or markup classes, document them in deck.js/README.md and update export processors.
- After code changes: Rebuild the bundles, smoke‑test navigation, scaling, menu, notes/export, a few dv animations forward/backwards, and hash deep‑links.

Further reading
- Detailed module documentation: deck.js/README.md (custom behaviour, module map, keyboard model, export pipeline, build notes).
- Upstream deck.js project: https://github.com/imakewebthings/deck.js
