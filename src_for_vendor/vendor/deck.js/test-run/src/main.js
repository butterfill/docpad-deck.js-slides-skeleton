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

import './deck.css';
import './styles.css';

const deckModules = [
  () => import('@deck/deck.core.js'),
  () => import('@deck/deck.events.js'),
  () => import('@deck/deck.fit.js'),
  () => import('@deck/deck.menu.js'),
  () => import('@deck/deck.hash.js'),
  () => import('@deck/deck.notes.js'),
  () => import('@deck/deck.remote.js'),
  () => import('@deck/deck.clone.js'),
  () => import('@deck/deck.slide-clone.js'),
  () => import('@deck/deck.step.js'),
  () => import('@deck/deck.velocity.js'),
  () => import('@deck/deck.init.js')
];

(async () => {
  for (const load of deckModules) {
    await load();
  }
})();
