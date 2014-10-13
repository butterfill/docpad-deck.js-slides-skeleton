What It Does
============

This is a collection of files for creating slideshow presentations using html.

Status
======

I'm not ready to share this work, it's only here as my personal backup.  But if you
really wanted to try it out you could.  Be warned that it's temperamental and when things go wrong, as they often do, the error messages are hard to decode.  Most likely it won't work at all.


Requirements
============
You are familiar with, or prepared to learn, how to write simple html in a language that compiles to html called [jade](http://jade-lang.com/).  It helps to understand basic CSS too.



Getting Started
===============

Install [node](http://nodejs.org/download/); this is a javascript runtime a tiny bit like java.

Install [docpad](https://docpad.org/docs/install) by opening a terminal and typing:

`npm install -g npm; npm install -g docpad@6.69`

Now download the files here and put them into a new folder (you can use the 'download ZIP' button that's usually somewhere on the right).

Open a terminal and navigate to the folder.

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


Support
=======

Sorry, you're on your own.
