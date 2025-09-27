#!/bin/bash

echo "you may need to install some things"
echo "uglifyjs: npm install uglify-js -g"
echo "cleancss: npm install clean-css-cli -g"

uglifyjs  \
  jquery.min.js \
  jquery-svgfix.js \
  twitter-bootstrap/js/bootstrap.min.js \
  modernizr.min.js \
  -c -o for.frontpage.all.min.js

cleancss -o for.frontpage.all.css \
  twitter-bootstrap/css/bootstrap2.min.css \
  twitter-bootstrap/css/bootstrap-responsive.min.css  

uglifyjs  \
  jquery.min.js \
  jquery-svgfix.js \
  jquery.crSplineBkg.js \
  velocity.min.js \
  marked.min.js \
  rainyday.js \
  circletype.js \
  modernizr.custom.01932.js \
  jquery.jsPlumb-1.3.16-all-min.js \
  questionmark.js/question.mark.js \
  screenfull.js \
  rough-notation.iife.js \
  deck.js/deck.core.js \
  deck.js/deck.events.js \
  deck.js/deck.fit.js \
  deck.js/deck.menu.js \
  deck.js/deck.hash.js \
  deck.js/deck.notes.js \
  deck.js/deck.transcripts.js \
  deck.js/deck.slide-clone.js \
  deck.js/deck.step.js \
  deck.js/deck.events.js \
  deck.js/deck.velocity.js \
  deck.js/deck.init.js \
  -c -o for.slides.all.min.js

cleancss -o for.slides.all.css \
  boilerplate.min.css \
  normalize.min.css \
  960_12_col_custom.min.css \
  deck.js/deck.core.css \
  deck.js/deck.menu.css \
  deck.js/deck.hash.css \
  deck.js/deck.notes.css \
  deck.js/deck.transcripts.css \
  questionmark.js/question.mark.css
