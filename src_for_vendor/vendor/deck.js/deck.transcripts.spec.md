# Deck.js Transcripts Plugin (deck.transcripts.js) — Specification

Status: v1 Draft

Purpose
- Provide a deck.js extension that loads a per-deck transcripts JSON file and:
  - Fills inline transcript placeholders inside slides.
  - Shows a live transcripts panel on the right, synchronized to navigation, with support for top-level/child slide inheritance.
  - Exports transcripts in a LaTeX-friendly view.

Non-goals (v1)
- No search, highlight, or clipboard features.
- No markdown rendering; treat text as trusted plain text (no escaping/sanitizing).

Terminology
- Placeholder: An element in a slide markup intended to receive transcript text, e.g., `<div class="transcript" id="<transcript_id>">...</div>`.
- Transcript item: An object from the JSON file `{ transcript_id: string, transcript_text: string }`.
- Top-level slide: A slide that is not nested within another slide.

---

1. Markup and Containers

1.1 Transcript placeholders inside slides
- Author places `.transcript` elements into slide markup.
- Mapping rule: the transcript id comes from the element’s `id` (or `data-transcript-id` if configured).
- Replacement rule:
  - If the element’s content is empty/missing OR matches the sentinel pattern `insert-transcript#<id>-here`, the plugin replaces the content with the corresponding `transcript_text` from JSON.
  - Otherwise existing content is preserved and that placeholder is skipped.
- Missing id in JSON:
  - Replace sentinel-like content with `[no transcript]`.
  - Add class `.transcript-missing` to the element.
  - Emit `deck.transcripts.missingId` with detail `{ id, element }`.
  - Do NOT log to console for missing ids.
- Inline visibility:
  - Keep relying on existing CSS in `deck.notes.css`: `.deck-container .transcript:not(.show) { display: none; }` so inline transcripts stay hidden unless `.show`.

1.2 Transcripts panel container (right side)
- Expect a sibling before `.deck-container`:
  ```html
  <section class="deck-transcripts" role="complementary" aria-live="polite">
    <div class="deck-transcripts-container"></div>
  </section>
  ```
- If absent, plugin MAY auto-insert this structure immediately before the `.deck-container`.
- The panel appears on the right (styling guidance in §9).
- Panel may coexist with notes/handout panels; no transforms are applied by this plugin to `.deck-container`.

---

2. JSON Source and Loading

2.1 URL resolution
- Use `window.location.pathname`, replace a trailing `.html` with `.json`.
  - Examples:
    - `/units/asking_questions.html` → `/units/asking_questions.json`
    - `/talks/lecture_01.html` → `/talks/lecture_01.json`
- Single JSON file per deck page. If missing (404), log a console message and emit `deck.transcripts.loadFailed`.

2.2 Data model
- JSON is an array of objects: `{ transcript_id: string, transcript_text: string }`.
- Build a map `id → text`. If duplicates occur, the last one wins.
- Treat transcript_text as trusted text (no escaping/sanitization in v1).

2.3 Load timing
- Load on `deck.init` with a small delay (~250ms) to avoid interfering with deck bootstrap.
- If user toggles the transcripts panel before load completes, show a temporary state (e.g., `Loading…`) in the panel.

---

3. Behavior and Synchronization

3.1 Filling placeholders
- On or after load succeeds, scan the deck for `.transcript` placeholders.
- For each placeholder, apply the replacement rule defined in §1.1.

3.2 Panel content — current vs. ancestor slide
- The live panel shows the transcripts for the current slide, synchronized with navigation.
- Inheritance rule for nested slides:
  - Many transcripts exist only for top-level slides. While navigating child slides, keep showing the transcript of the nearest ancestor that has a transcript, UNLESS the child itself has at least one transcript placeholder (then show the child’s transcripts instead).
- Determining whether a slide “has a transcript”:
  - A slide is considered to “have a transcript” if it contains one or more `.transcript` placeholders, regardless of whether they successfully resolve to JSON items.
- On `deck.change`:
  1) Identify the current slide (`to`) and compute the “effective slide” for transcripts:
     - If the slide has any `.transcript` placeholders: use it.
     - Else recursively search parent slides for one that has `.transcript` placeholders and use the nearest such ancestor.
     - If no ancestor has transcripts: panel shows nothing (or a friendly empty state), but remains visible if toggled on.
  2) Render that slide’s transcript items in the panel. Emit `deck.transcripts.renderedForSlide` with `{ slideId }`.

3.3 Export view (Shift+t)
- Hide `.deck-container`.
- Show all transcripts across the deck, grouped by slide id in document order. For each slide that “has a transcript” (§3.2):
  - Insert a LaTeX-friendly header `\subsection{<slide_id>}` (escape underscores with `\\_`).
  - For each transcript placeholder in that slide, output its resolved text, or `[no transcript]` for missing IDs.
- Apply LaTeX escapes/mappings to the export content similar to `deck.notes.js` (see §6.2).
- Keep export independent of notes/handout exports; multiple panels may exist and be independently toggled.

---

4. Keyboard Shortcuts and Commands

4.1 Keys (configurable)
- `t` (84): toggle live transcripts panel.
- `Shift+t`: toggle transcripts export view.
- `Alt+t`: toggle large/compact panel width.

4.2 jQuery deck API methods
- `$.deck('loadTranscripts', url?) → Promise<void>`
  - Load JSON (optional `url` overrides auto-resolution).
  - Emits `deck.transcripts.loaded` on success, `deck.transcripts.loadFailed` on error.
- `$.deck('getTranscript', id) → string | undefined`
- `$.deck('toggleTranscripts')`
- `$.deck('showTranscripts')`
- `$.deck('hideTranscripts')`
- `$.deck('toggleTranscriptsExport')`
- `$.deck('showTranscriptsExport')`
- `$.deck('hideTranscriptsExport')`

4.3 Events (jQuery)
- `deck.transcripts.loaded` (detail: `{ count }`) — fired after successful load and indexing.
- `deck.transcripts.loadFailed` (detail: `{ url, error }`) — fired on fetch/parse failure.
- `deck.transcripts.missingId` (detail: `{ id, element }`) — when a placeholder id is not present in JSON.
- `deck.transcripts.renderedForSlide` (detail: `{ slideId }`) — after panel content is updated for a slide.

---

5. Options

Provide via `$.extend(true, $[deck].defaults, { ... })` pattern.

- `classes` (defaults):
  - `transcripts: 'deck-transcripts'`
  - `transcriptsContainer: 'deck-transcripts-container'`
- `keys` (defaults):
  - `transcripts: 84` // t
- `transcriptsUrl` (default: `'auto'`)
  - `'auto'`: derive from `window.location.pathname` by replacing `.html` → `.json`.
  - `string`: absolute or relative URL.
  - `string[]`: multiple files, later items override earlier on id conflicts (v1 supports single file; array is future-compatible).
- `idAttr` (default: `'id'`) — `'id' | 'data-transcript-id'`.
- `render` (defaults):
  - `allowHtml: false` (ignored in v1; content is inserted as textContent-equivalent without escaping; see §7).
  - `markdown: false` (future option; not implemented in v1).
  - `latexExportEscapes: true` (apply mappings in export view).
- `behavior` (defaults):
  - `showCurrentSlideOnly: true`
  - `fillPlaceholders: true`
  - `removeMissing: false` (leave elements, add `.transcript-missing`, replace sentinel with `[no transcript]`).
- `load` (defaults):
  - `strategy: 'onInit'` | `'onFirstToggle'` (default: `'onInit'` with ~250ms delay).

---

6. Text Handling

6.1 Live view (panel and inline)
- Treat transcript_text as trusted plain text. Do not HTML-escape or sanitize in v1.
- Insertion should preserve line breaks; panel CSS should apply `white-space: pre-wrap`.

6.2 Export view LaTeX handling
- Apply escapes/mappings similar to `deck.notes.js` to panel export before rendering:
  - `&` → `\&`
  - `⫤⊨` → `$\\leftmodels\\models$`
  - `⫤` → `$\\leftmodels$`
  - `⊨TT` → `$\\vDash _{TT}$`
  - `⊨` → `$\\vDash$`
  - `⊭TT` → `$\\nvDash _{TT}$`
  - `⊥` → `$\\bot$`
  - `⊢` → `$\\vdash$`
  - `⊬` → `$\\nvdash$`
  - `⊭` → `$\\nvDash$`

---

7. Accessibility
- The transcripts panel container should have `role="complementary"` and `aria-live="polite"`.
- When content updates on `deck.change`, screen readers should be notified without stealing focus.
- Keyboard shortcuts match notes’ ergonomics; tab order should allow reaching the panel content.

---

8. Failure Modes and Logging
- JSON missing (404) or parse error:
  - Log to console (single concise message), and fire `deck.transcripts.loadFailed` with `{ url, error }`.
  - Toggling the panel shows a non-fatal empty state (e.g., `No transcripts found`).
- Missing id for a specific placeholder:
  - Do not console.warn; handle as specified in §1.1 and fire `deck.transcripts.missingId`.

---

9. Styling Guidance (CSS)

Suggested base (parallel to deck.notes.css), to be placed in deck.notes.css or a new deck.transcripts.css:
- Right-side panel, fixed width; large-format variant; pre-wrap text.
- Example (illustrative only):
  ```css
  .deck-transcripts {
    position: absolute;
    background: #fff;
    z-index: 15;
    top: 0; bottom: 0; right: 0; /* right panel */
    width: 250px;
    display: none;
    overflow-y: auto;
    white-space: pre-wrap;
  }
  .deck-transcripts.large-format { width: 500px; }
  .deck-transcripts .deck-transcripts-container { padding: 0.625em; font-size: 16px; font-family: "Lato", sans-serif; color: #000; }
  /* export view can widen similar to notes */
  .deck-transcripts.export { left: 25px; width: 800px; right: auto; }
  ```

Panel coexistence
- This plugin does not apply any transform to `.deck-container` when showing the panel.
- It may be used alongside notes/handout panels.

---

10. Implementation Outline

10.1 Plugin setup
- Extend defaults with options in §5.
- Expose methods in §4.2 via `$.deck('extend', ...)`.
- Bind to `deck.init` (schedule load) and `deck.change` (update panel content per §3.2).

10.2 Load strategy
- On `deck.init` (after ~250ms): resolve URL per §2.1; fetch JSON via `fetch` with fallback to `$.ajax`.
- Build `id → text` map; emit `deck.transcripts.loaded` with `{ count }`.

10.3 Placeholder filling algorithm (pseudocode)
```js
const SENTINEL_RE = /^\s*insert-transcript#([a-f0-9-]+)-here\s*$/i;

function fillPlaceholders(doc, index, opts) {
  const idAttr = opts.idAttr || 'id';
  $(doc).find('.deck-container .transcript').each(function() {
    const el = this;
    const id = el.getAttribute(idAttr);
    if (!id) return;
    const text = index[id]; // may be undefined
    const raw = el.textContent.trim();
    const looksLikeSentinel = SENTINEL_RE.test(raw);

    if (raw.length === 0 || looksLikeSentinel) {
      if (text != null) {
        el.textContent = text; // trusted; no escaping in v1
      } else {
        el.textContent = '[no transcript]';
        el.classList.add('transcript-missing');
        $(document).trigger('deck.transcripts.missingId', [{ id, element: el }]);
      }
    } // else: leave existing content as-is
  });
}
```

10.4 Determining effective slide for the panel (pseudocode)
```js
function slideHasTranscript($slide) {
  return $slide.find('.transcript').length > 0;
}

function getEffectiveSlideForTranscripts($current) {
  if (slideHasTranscript($current)) return $current;
  // Prefer deck.step helper if available
  if ($.deck && $[deck] && $[deck]('getToplevelSlideOf')) {
    const $top = $[deck]('getToplevelSlideOf', $current);
    return slideHasTranscript($top) ? $top : $();
  }
  // Fallback: walk ancestors until a sibling of .deck-container
  let $p = $current.parent();
  while ($p && !$p.is('body')) {
    if ($p.hasClass('slide') && slideHasTranscript($p)) return $p;
    $p = $p.parent();
  }
  return $();
}

function renderPanelForSlide($slide, index, $container) {
  $container.empty();
  if (!$slide || !$slide.length) return; // nothing to render
  $slide.find('.transcript').each(function() {
    const id = this.id || this.getAttribute('data-transcript-id');
    const text = index[id];
    $container.append($('<div class="transcript">').text(text != null ? text : '[no transcript]'));
  });
  $(document).trigger('deck.transcripts.renderedForSlide', [{ slideId: $slide.attr('id') }]);
}
```

10.5 Export view rendering
- Build the panel content by iterating slides in document order.
- For each slide that “has a transcript,” append `\\subsection{<slide_id>}` then each transcript block.
- Apply LaTeX mappings in §6.2 to the rendered text.

10.6 Keyboard handling
- On `keydown`, mirror the pattern in `deck.notes.js` for `t`, `Shift+t`, `Alt+t`.
- Do not prevent default for unrelated keys.

---

11. Compatibility and Dependencies
- Browser support: evergreen (same as deck stack).
- Dependencies: jQuery and deck.js runtime. No additional libraries in v1.
- Loading order: after core deck modules (`deck.core.js`, `deck.events.js`, `deck.step.js`) and before/after notes as needed.

---

12. Examples

12.1 HTML skeleton
```html
<section class="deck-transcripts"><div class="deck-transcripts-container"></div></section>
<section class="deck-notes"><div class="deck-notes-container"></div></section>
<section class="deck-handout"><div class="deck-handout-container"></div></section>
<div class="deck-container">
  <section class="slide" id="intro">
    <div class="transcript" id="d7be4f4f-b0fe-415e-a300-7be58d05eb78">insert-transcript#d7be4f4f-b0fe-415e-a300-7be58d05eb78-here</div>
  </section>
  <section class="slide">
    <!-- child of intro; inherits intro transcript if no local .transcript -->
  </section>
</div>
```

12.2 JSON
```json
[
  { "transcript_id": "d7be4f4f-b0fe-415e-a300-7be58d05eb78", "transcript_text": "Welcome ..." }
]
```

12.3 Usage
- Load the page. After ~250ms from `deck.init`, the plugin fetches `/path/current-page.json`.
- Press `t` to toggle the panel. It shows the current slide’s transcripts (or nearest ancestor’s).
- Press `Shift+t` for the export view; slides are hidden; transcripts appear with LaTeX-friendly headers.
- Press `Alt+t` to widen the panel.

---

13. Testing Checklist (Smoke)
- JSON present/absent; 404 behavior with console log; `deck.transcripts.loadFailed` fired.
- Placeholders resolved; sentinel replaced; missing ids produce `[no transcript]` + `.transcript-missing` and event.
- Navigation: panel inherits from top-level; switches to child when child has transcript placeholders.
- Export: slides hidden; all transcripts listed with `\\subsection{...}`; LaTeX mappings applied.
- Coexistence: notes (`n`/`Shift+n`/`Alt+n`) and transcripts (`t`/`Shift+t`/`Alt+t`) operate independently.

---

14. Future Extensions (Out of Scope v1)
- Markdown rendering of transcript_text (option `markdown: true`).
- Search and highlight within transcripts.
- In-panel filtering by slide id or transcript id.
- Copy-to-clipboard helpers.
