---
title: "ideas to improve deck.js slides (pugdeck)"
created: 2022-08-22
tags:
  -
projects:
  - c0tpPCvT4IKQbhdZ1m440
---



* [ ] Better highlights 
  1. (dim everything and just highlight one element, allowing a pop-up window):
     * Could use \ref{url:https://github.com/kamranahmedse/driver.js}
  1. use rough notation \ref{url:https://github.com/rough-stuff/rough-notation}
     * need to work around the fact that slides use css scale, see \ref{url:https://github.com/rough-stuff/rough-notation/issues/75}
       * fix =
         ```
         const scaler = document.querySelector('.remark-slide-scaler');
         const scale = Number(/scale\((\d+\.?\d*)\)/.exec(scaler.style.transform)[1]);
         annotation._svg.style.transform = `scale(${1/scale})`;
         ```

* [ ] title page cloud animation with `Vanta.js` \ref{url:https://www.vantajs.com/?effect=fog#(backgroundAlpha:1,baseColor:16772075,blurFactor:0.54,gyroControls:!f,highlightColor:16118508,lowlightColor:0,midtoneColor:7039851,minHeight:200,minWidth:200,mouseControls:!t,scale:2,scaleMobile:4,speed:0.30000000000000004,touchControls:!t,zoom:1.9000000000000001)}

* [ ] Enable use of tailwindcss in writing slides?

* [ ] option to use with vite where pug is compiled on the fly (sveltkit on-the-fly way (see `~/tmp2/vite-deck`)) and reloads are automatic?
  1. might be tricky to manage mixins?

* [ ] table of contents for the sections in a lecture slide?

* [ ] ninja keys for sections?

* [no] `<mixins>` block in lecture that gets added to all units in the lecture?  Bad idea: what if the unit gets moved? Better to have a mixins file for the lecture series.
  * but this is really useful for things like the plan for a lecture, where that would have to come
    out of the units if they were moved.
  * (Things are a bit different when doing recorded units (where self-contained is critical)
    and in-person lectures (where a connected whole is critical).)


* [no] lunr search slide contents (for slides from all units?)?

* [x] click to edit (use shift+meta)

* [x] Images for section title slides (use `title_image` property)

* [x] when making lectures, do not show section title slides if `title_slide: false` is set

* [ ] [no—requires a link to the author!] simple title slide animations \ref{url:https://neat.camberi.com/} = \ref{url:https://github.com/FireCMSco/neat}

