What It Does
============

This is a collection of files for creating slideshow presentations using html.

Status
======

I'm not ready to share this work, it's only here as my personal backup.  But if you
really wanted to try it out you could.  Be warned that it's temperamental and when things go wrong, as they often do, the error messages are hard to decode.  Most likely it won't work at all.


Requirements
============
You are familiar with, or prepared to learn, the basics of a language called [jade](http://jade-lang.com/).
This is a template language that compiles to html.
(You could write html if you preferred, but it's less work to use jade or something like it.)

It helps to understand basic CSS and javascript too.



Getting Started
===============

Install [node](http://nodejs.org/download/); this is a javascript runtime a tiny bit like java.

Install [docpad](https://docpad.org/docs/install) by opening a terminal and typing:

`npm install -g npm; npm install -g docpad`

Now download the files here and put them into a new folder (you can use the 'download ZIP' button that's usually somewhere on the right).

Open a terminal and navigate to the folder where you put the files.

Type and run this command:

`npm install`

to check everything you need for this presentation is installed.

Also type and run:

`docpad generate --env static`

to check it works.

If you have no errors, you can type 

`docpad run`

Now open [http://0.0.0.0:9778/](http://0.0.0.0:9778/) in a web browser and you should see some slides.  
What you're looking at are slides on your local machine, not the web.
If you see some slides, it works!

To edit these slides and make them your own, navigate into the `src` director, then `documents` and open the file index.html.jade in a text editor.

The file testing.html.jade, which is also in the `document` folder, has some examples in it.  You can view this file by opening [http://0.0.0.0:9778/testing.html](http://0.0.0.0:9778/testing.html) in a web browser.


What Is It?
===========

The files here comprise a [docpad](https://docpad.org/) project that combines a lightly modified version of [deck.js](https://github.com/imakewebthings/deck.js) with a few other javascript and css components and a collection of jade mixins to make writing slides simple.

[docpad](https://docpad.org/) is a static site builder; it creates a bunch of template and source files and makes web pages from them.

[deck.js](https://github.com/imakewebthings/deck.js) is some javascript and css that allows you to make slide show presentations using HTML instead of having to mess with things like powerpoint.


Why?
====

It's quicker to create and update slide shows this way.  Suppose you want a slide with some text in the middle:

`+slide_middle
  p.center This is a message in the middle of a slide.`

Do the same but with an image as background

`+slide_middle({img:'flowers.png'})
  p.center This is a message in the middle of a slide.`

where `flowers.png` is the name of a file in `src/raw/img`.

Create a two column layout:

`+slide_rh_white
  +run_across
    p What is this question?
  +left_half
    p One type of answer.
  +right_half
    p Another type of answer.`

Do the same but use three slides, where the sentence are added to the slides in turn:

`+slide_rh_white
  +run_across
    p What is this question?
  .slide
    +left_half
      p One type of answer.
  .slide
    +right_half
      p Another type of answer.`

Add some notes (which you can view by pressing `n` while looking at the slides, and export for use with a latex template by pressing `N`):

`+slide_rh_white
  +run_across
    p What is this question?
    .notes This issue goes back at least as far as Plato, who said ... Consider two answers.
  .slide
    +left_half
      p One type of answer.
  .slide
    +right_half
      p Another type of answer.`


Support
=======

Sorry, you're on your own.
