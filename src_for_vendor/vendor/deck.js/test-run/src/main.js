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

import '../../deck.core.js';
import '../../deck.events.js';
import '../../deck.fit.js';
import '../../deck.menu.js';
import '../../deck.hash.js';
import '../../deck.notes.js';
import '../../deck.remote.js';
import '../../deck.clone.js';
import '../../deck.slide-clone.js';
import '../../deck.step.js';
import '../../deck.velocity.js';
import '../../deck.init.js';
