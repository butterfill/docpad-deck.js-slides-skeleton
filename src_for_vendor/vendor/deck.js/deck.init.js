
/**
 * (c) 2013-7 Stephen A. Butterfill
 *
 * Code to configure the deck presentation and plugins.
 * This isn't a plugin itself.
 *
 * Load after deck.js, jsPlumb &c
 */


$(function() {
  
  // Deck initialization
  $.deck('.slide', {
    fitMode: "center middle",
    designWidth: 800,
    designHeight: 600,
    fitMarginX: 0,
    fitMarginY: 0
  });
  
  
  // -------
  // add actions created in the presentation using the `add action`
  
  var addCustomActions = function() {
    window.deckSlideActions = window.deckSlideActions || [];
    $.each(deckSlideActions, function(i, action){
      // work out which slide to attach the action to
      var scriptEl = action.scriptEl;
      $slide = $(scriptEl).parents('.slide').first();
      var slideIdx = $.deck('getSlideIndex', $slide);
      
      $.deck('addSlideAction', slideIdx, action);
    });
    
    $.deck('forceRefresh');
  };
  
  // bind to deckVelocityInit rather than to deckSlideActionsInit because 
  // deckVelocityInit adds actions too
  $(document).bind('deckVelocityInit', function(event) {
    setTimeout(addCustomActions, 10);
    $(document).unbind(event);
  });
  
  // -------
  
});


/**
 * jsPlumb defaults
 */
if( typeof jsPlumb !== 'undefined'){
  jsPlumb.Defaults.PaintStyle = {
    lineWidth:2,
    strokeStyle: 'rgba(255,255,0,1)',
    outlineColor: 'black',
    outlineWidth: 1
  }
  jsPlumb.Defaults.Endpoints = [
    ["Dot", {radius:3}],
    ["Dot", {radius:3}]
  ]

  //- DOESNT WORK
  $(document).ready(function(){
    jsPlumb.ready(function(){

      jsPlumb.importDefaults({
        PaintStyle : {
          lineWidth:2,
          strokeStyle: 'rgba(255,255,0,1)',
          outlineColor: 'black',
          outlineWidth: 1
        }
      })
    
    })
  })
  
}

/**
 * stolen from the deck.scale extension
 * parameter is target height in pixels (e.g. 500)
 */
window.scaleDeck = function(baseHeight) {
    var opts = $.deck('getOptions');
    var $container = $.deck('getContainer');

    var slideTest = $.map([
        opts.classes.before,
        opts.classes.previous,
        opts.classes.current,
        opts.classes.next,
        opts.classes.after
    ], function(el, i) {
        return '.' + el;
    }).join(', ');

    // Build top level slides array
    var rootSlides = [];
    $.each($.deck('getSlides'), function(i, $el) {
        if (!$el.parentsUntil(opts.selectors.container, slideTest).length) {
            rootSlides.push($el);
        }
    });

    // Scale each slide down if necessary (but don't scale up)
    $.each(rootSlides, function(i, $slide) {
        var slideHeight = $slide.innerHeight(),
        $scaler = $slide
        scale = baseHeight / slideHeight;
        
        $.each('Webkit Moz O ms Khtml'.split(' '), function(i, prefix) {
            if (scale === 1) {
                $scaler.css(prefix + 'Transform', '');
            }
            else {
                $scaler.css(prefix + 'Transform', 'scale(' + scale + ')');
            }
        });
    });
}
