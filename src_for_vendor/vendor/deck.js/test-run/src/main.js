import $ from 'jquery';

window.$ = $;
window.jQuery = $;

if (!window.Modernizr) {
  window.Modernizr = {
    history: true,
    hashchange: true,
    csstransforms: true
  };
}

import '../../deck.core.css';
import '../../deck.menu.css';
import '../../deck.hash.css';
import '../../deck.notes.css';
import './styles.css';

const deckModules = [
  '../../deck.core.js',
  '../../deck.events.js',
  '../../deck.fit.js',
  '../../deck.menu.js',
  '../../deck.hash.js',
  '../../deck.notes.js',
  '../../deck.remote.js',
  '../../deck.clone.js',
  '../../deck.slide-clone.js',
  '../../deck.step.js',
  '../../deck.velocity.js',
  '../../deck.init.js'
];

(async () => {
  for (const modulePath of deckModules) {
    await import(modulePath);
  }
})();
