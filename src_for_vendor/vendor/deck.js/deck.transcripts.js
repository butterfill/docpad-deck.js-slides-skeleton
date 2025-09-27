/*!
 * Deck JS - deck.transcripts
 * Copyright (c) 2025
 *
 * Provides a transcripts side panel and inline placeholder filling.
 *
 * See deck.transcripts.spec.md for full behavior.
 */
(function($, deck, undefined) {
  var $d = $(document);

  var SENTINEL_RE = /^\s*insert-transcript#([a-f0-9-]+)-here\s*$/i;

  function resolveUrlAuto() {
    try {
      var path = window.location.pathname || '';
      if (/\.html(\?.*)?$/i.test(path)) {
        return path.replace(/\.html(\?.*)?$/i, '.json');
      }
      // If not ending with .html, append .json
      if (!/\.json(\?.*)?$/i.test(path)) {
        if (path.endsWith('/')) return path + 'index.json';
        return path + '.json';
      }
      return path;
    } catch (e) {
      return null;
    }
  }

  function latexMap(s) {
    if (!s) return s;
    return s
      .replace(/&/g, '\\&')
      .replace(/⫤⊨/g, '$\\leftmodels\\models$')
      .replace(/⫤/g, '$\\leftmodels$')
      .replace(/⊨TT/g, '$\\vDash _{TT}$')
      .replace(/⊨/g, '$\\vDash$')
      .replace(/⊭TT/g, '$\\nvDash _{TT}$')
      .replace(/⊥/g, '$\\bot$')
      .replace(/⊢/g, '$\\vdash$')
      .replace(/⊬/g, '$\\nvdash$')
      .replace(/⊭/g, '$\\nvDash$');
  }

  function ensurePanel(opts) {
    var cls = opts.classes.transcripts;
    var $panel = $('.' + cls);
    if ($panel.length === 0) {
      var $container = $('<section>').addClass(cls).attr({ role: 'complementary', 'aria-live': 'polite' })
        .append($('<div>').addClass(opts.classes.transcriptsContainer));
      var $deckContainer = $[deck]('getContainer');
      $container.insertBefore($deckContainer);
      $panel = $container;
    }
    return $panel;
  }

  function applyLiveTransform(opts) {
    var $panel = $('.' + opts.classes.transcripts);
    var $deckContainer = $('.deck-container');
    if (!$panel.is(':visible')) {
      // reset
      $deckContainer.css({ transform: '' });
      return;
    }
    if ($panel.hasClass('export')) {
      $deckContainer.css({ transform: '' });
      return;
    }
    var w = $panel.outerWidth() || 0;
    var isLarge = $panel.hasClass('large-format');
    var scale = isLarge ? 0.55 : 0.8;
    var tx = -(Math.round((w / 2) + (isLarge ? 100 : 0))); // shift left by ~half panel width (+ extra for large)
    var ty = 0; // keep vertical center for readability
    $deckContainer.css({ transform: 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ',' + scale + ')' });
  }

  function getPanelContainer(opts) {
    return $('.' + opts.classes.transcripts + ' .' + opts.classes.transcriptsContainer);
  }

  function buildIndex(items) {
    var idx = {};
    if ($.isArray(items)) {
      $.each(items, function(i, it) {
        if (it && it.transcript_id != null) {
          idx[it.transcript_id] = it.transcript_text != null ? String(it.transcript_text) : '';
        }
      });
    }
    return idx;
  }

  function fillPlaceholders(index, opts) {
    if (opts.behavior && opts.behavior.fillPlaceholders === false) return;
    var idAttr = opts.idAttr || 'id';
    $('.deck-container .transcript').each(function() {
      var el = this;
      var id = el.getAttribute(idAttr);
      if (!id) return;
      var text = index[id]; // may be undefined
      var raw = (el.textContent || '').trim();
      var looksLikeSentinel = SENTINEL_RE.test(raw);

      if (raw.length === 0 || looksLikeSentinel) {
        if (text != null) {
          // trusted content; insert as text
          el.textContent = text;
        } else {
          el.textContent = '[no transcript]';
          el.classList.add('transcript-missing');
          $d.trigger('deck.transcripts.missingId', [{ id: id, element: el }]);
        }
      }
    });
  }

  function slideHasTranscript($slide) {
    return $slide && $slide.length && $slide.find('.transcript').length > 0;
  }

  function getEffectiveSlideForTranscripts($current) {
    if (!$current || !$current.length) return $();
    if (slideHasTranscript($current)) return $current;
    // Try deck.step helper
    try {
      if ($[deck] && $[deck]('getToplevelSlideOf')) {
        var $top = $[deck]('getToplevelSlideOf', $current);
        if (slideHasTranscript($top)) return $top;
      }
    } catch (e) {}
    // Fallback: walk ancestors
    var $p = $current.parent();
    while ($p && $p.length && !$p.is('body')) {
      if ($p.hasClass('slide') && slideHasTranscript($p)) return $p;
      $p = $p.parent();
    }
    return $();
  }

  function renderPanelForSlide($slide, index, opts) {
    var $container = getPanelContainer(opts);
    $container.empty();
    if (!$slide || !$slide.length) return;
    $slide.find('.transcript').each(function() {
      var id = this.getAttribute(opts.idAttr || 'id');
      var text = index[id];
      var val = (text != null) ? text : '[no transcript]';
      if (text == null) {
        $d.trigger('deck.transcripts.missingId', [{ id: id, element: this }]);
      }
      $('<div class="transcript">').text(val).appendTo($container);
    });
    $d.trigger('deck.transcripts.renderedForSlide', [{ slideId: $slide.attr('id') }]);
  }

  function renderExportAll(index, opts) {
    var $container = getPanelContainer(opts);
    $container.empty();
    var seenAny = false;
    $($('.deck-container .slide')).each(function() {
      var $slide = $(this);
      if (!slideHasTranscript($slide)) return;
      seenAny = true;
      var slideId = $slide.attr('id') || '';
      var texId = (slideId + '').replace(/_/g, '\\_');
      $('<div class="transcripts-header-tex">').text('\\subsection{' + texId + '}').appendTo($container);
      $slide.find('.transcript').each(function() {
        var id = this.getAttribute(opts.idAttr || 'id');
        var text = index[id];
        var val = (text != null) ? text : '[no transcript]';
        $('<div class="transcript for-' + slideId + '">').text(val).appendTo($container);
      });
      $('<div class="transcript">').html('&nbsp;').appendTo($container);
    });

    if (opts.render && opts.render.latexExportEscapes) {
      // Apply latex mappings to each text node in the container
      $container.contents().each(function() {
        if (this.nodeType === 3) {
          this.nodeValue = latexMap(this.nodeValue);
        } else if (this.nodeType === 1) {
          // element: replace its textContent
          this.textContent = latexMap(this.textContent);
        }
      });
    }
    return seenAny;
  }

  // Extend defaults/options
  $.extend(true, $[deck].defaults, {
    classes: {
      transcripts: 'deck-transcripts',
      transcriptsContainer: 'deck-transcripts-container'
    },
    keys: {
      transcripts: 84 // 't'
    },
    transcriptsUrl: 'auto',
    idAttr: 'id',
    render: {
      allowHtml: false,
      markdown: false,
      latexExportEscapes: true
    },
    behavior: {
      showCurrentSlideOnly: true,
      fillPlaceholders: true,
      removeMissing: false
    },
    load: {
      strategy: 'onInit',
      delayMs: 250
    }
  });

  var state = {
    index: {},
    loaded: false,
    loading: false,
    exportMode: false
  };

  function doLoad(opts, overrideUrl) {
    if (state.loaded || state.loading) return state.promise || $.Deferred().resolve().promise();
    state.loading = true;
    var url = overrideUrl || (opts.transcriptsUrl === 'auto' ? resolveUrlAuto() : opts.transcriptsUrl);
    var dfd = $.Deferred();
    state.promise = dfd.promise();

    function onSuccess(items) {
      state.index = buildIndex(items || []);
      state.loaded = true;
      state.loading = false;
      $d.trigger('deck.transcripts.loaded', [{ count: Object.keys(state.index).length }]);
      try { fillPlaceholders(state.index, opts); } catch (e) {}
      dfd.resolve();
    }
    function onError(err) {
      state.loading = false;
      console.error('deck.transcripts: failed to load', url, err);
      $d.trigger('deck.transcripts.loadFailed', [{ url: url, error: err }]);
      dfd.reject(err);
    }

    try {
      if (typeof fetch === 'function') {
        fetch(url, { credentials: 'same-origin' }).then(function(res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        }).then(onSuccess).catch(onError);
      } else {
        $.ajax({ url: url, dataType: 'json' }).done(onSuccess).fail(onError);
      }
    } catch (e) { onError(e); }

    return dfd.promise();
  }

  // Methods
  $[deck]('extend', 'loadTranscripts', function(url) {
    var opts = $[deck]('getOptions');
    return doLoad(opts, url);
  });

  $[deck]('extend', 'getTranscript', function(id) {
    return state.index[id];
  });

  $[deck]('extend', 'showTranscripts', function() {
    var opts = $[deck]('getOptions');
    var $panel = ensurePanel(opts).show();
    state.exportMode = false;
    applyLiveTransform(opts);
    // render current slide immediately
    var $current = $[deck]('getSlide');
    var $effective = getEffectiveSlideForTranscripts($current);
    renderPanelForSlide($effective, state.index, opts);
  });

  $[deck]('extend', 'hideTranscripts', function() {
    var opts = $[deck]('getOptions');
    $('.' + opts.classes.transcripts).hide().removeClass('export');
    $('.deck-container').css({ transform: '' }).show();
    state.exportMode = false;
  });

  $[deck]('extend', 'toggleTranscripts', function() {
    var opts = $[deck]('getOptions');
    var $panel = $('.' + opts.classes.transcripts);
    if ($panel.is(':visible')) {
      $[deck]('hideTranscripts');
    } else {
      $[deck]('showTranscripts');
    }
  });

  $[deck]('extend', 'showTranscriptsExport', function() {
    var opts = $[deck]('getOptions');
    var $panel = ensurePanel(opts).addClass('export').show();
    $('.deck-container').hide().css({ transform: '' });
    state.exportMode = true;
    renderExportAll(state.index, opts);
  });

  $[deck]('extend', 'hideTranscriptsExport', function() {
    var opts = $[deck]('getOptions');
    $('.' + opts.classes.transcripts).removeClass('export').hide();
    $('.deck-container').show();
    state.exportMode = false;
  });

  $[deck]('extend', 'toggleTranscriptsExport', function() {
    var opts = $[deck]('getOptions');
    var $panel = $('.' + opts.classes.transcripts);
    $panel.hasClass('export') ? $[deck]('hideTranscriptsExport') : $[deck]('showTranscriptsExport');
  });

  // Init / event bindings
  $d.bind('deck.init', function() {
    var opts = $[deck]('getOptions');
    ensurePanel(opts);

    // keys
    $d.unbind('keydown.decktranscripts').bind('keydown.decktranscripts', function(e) {
      var key = opts.keys.transcripts;
      if (e.which === key || $.inArray(e.which, key) > -1) {
        if (e.altKey) {
          $('.' + opts.classes.transcripts).toggleClass('large-format');
        }
        if (e.shiftKey) {
          $[deck]('toggleTranscriptsExport');
        } else {
          $[deck]('toggleTranscripts');
        }
        e.preventDefault();
      }
    });

    // load strategy
    if (opts.load && opts.load.strategy === 'onInit') {
      var delay = (opts.load.delayMs == null) ? 250 : opts.load.delayMs;
      setTimeout(function(){ doLoad(opts); }, delay);
    }
  });

  $d.bind('deck.change', function(e, from, to) {
    var opts = $[deck]('getOptions');
    if (state.exportMode) return; // export renders all
    var $panel = $('.' + opts.classes.transcripts);
    if ($panel.is(':visible')) {
      applyLiveTransform(opts);
    }
    var $current = $[deck]('getSlide', to);
    var $effective = getEffectiveSlideForTranscripts($current);
    renderPanelForSlide($effective, state.index, opts);
  });

})(jQuery, 'deck');
