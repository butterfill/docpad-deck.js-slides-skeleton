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

Now download the files here and put them into a new folder
called `test_presentation` (say).  (To download the files you can use the 'download ZIP' button that's usually somewhere on the right.)

Open a terminal and navigate to `test_presentation`, which is the folder where you put the files.

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

To edit these slides and make them your own, go to the folder called `test_presentation` where you put all the files.  Now navigate into the `src` sub-folder, then into the `documents` sub-sub-folder, and then open the file index.html.jade in a text editor.

The file testing.html.jade, which is also in the `documents` folder, has some examples in it.  You can view the slides defined in this file  by opening [http://0.0.0.0:9778/testing.html](http://0.0.0.0:9778/testing.html) in a web browser.


Examples
========

Here's [a talk](www.butterfill.com/talk-slides/presenting_your_research) and the [source files](https://github.com/butterfill/lectures_presenting_your_research) for it.

Here's [a series of lectures](http://origins-of-mind.butterfill.com/) and the [source files](https://github.com/butterfill/lectures_origins_of_mind_warwick_2014_15) for them.



What Is It?
===========

The files here comprise a [docpad](https://docpad.org/) project that combines a lightly modified version of [deck.js](https://github.com/imakewebthings/deck.js) with a few other javascript and css components and a collection of jade mixins to make writing slides simple.

[docpad](https://docpad.org/) is a static site builder; it takes a bunch of template and source files and makes web pages from them.

[deck.js](https://github.com/imakewebthings/deck.js) is some javascript and css that allows you to make slide show presentations using HTML instead of having to mess with things like powerpoint.


Why?
====

It's quicker to create and update slide shows this way.  Suppose you want a slide with some centered text in the middle:

```jade
+slide_middle
  p.center This is a message in the middle of a slide.
```

Do the same but with an image as background

```jade
+slide_middle({bkg:'flowers.png'})
  p.center This is a message in the middle of a slide.
```

where `flowers.png` is the name of a file in `src/raw/img`.

Create a slide with a two column layout:

```jade
+slide_rh_white
  +run_across
    p What is this question?
  +left_half
    p One type of answer.
  +right_half
    p Another type of answer.
```

Do the same but use three slides and have the sentence added to the slides in turn:

```jade
+slide_rh_white
  +run_across
    p What is this question?
  .slide
    +left_half
      p One type of answer.
  .slide
    +right_half
      p Another type of answer.
```

Add some notes (which you can view by pressing `n` while looking at the slides, and export for use with a latex template by pressing `N`):

```jade
+slide_rh_white
  +run_across
    p What is this question?
    .notes This issue goes back at least as far as Plato, who said ... Consider two answers.
  .slide
    +left_half
      p One type of answer.
  .slide
    +right_half
      p Another type of answer.
```


How Do I Change the Title Page?
===============================

Edit the file `docpad.coffee` in a text editor.


How Do I Put My Slideshow Online?
=================================

Because your slideshow is entirely static documents (html plus css and javascript), you can use any web server you like.  

Run `docpad generate --env static` and then upload the files in the `out` directory onto
your web server; you can use whatever method you would normally use to upload a directory of static files.

Note: If you are uploading to a subfolder, be sure to modify `url` immediately under `absolutepath` in the file `docpad.coffee`.


Support
=======

Sorry, you're on your own.


