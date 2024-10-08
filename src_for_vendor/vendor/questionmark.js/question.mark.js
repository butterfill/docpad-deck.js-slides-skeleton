/*
    QuestionMark.js by Louis Lazaris
    https://github.com/impressivewebs/QuestionMark.js
    License: http://creativecommons.org/licenses/by/2.0/, no credit needed.

    Modified by Steve Butterfill 2014 -- cut the  Ajax thing,
    (requires that shortcut keys are specifed in the html file itself)

    ‘When the user pushes the ? key, QuestionMark.js triggers a modal window 
    that displays keyboard shortcuts for your app’. I use this for the help
    window.
*/

(function () {

    'use strict';

    function removeModal(helpUnderlay) {
        helpUnderlay.className = helpUnderlay.className.replace(/help-isVisible*/g, '');
        helpUnderlay.className = helpUnderlay.className.trim();
    }

    function getWindowWidth() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth;
            //var y = w.innerHeight || e.clientHeight || g.clientHeight;
        return x;
    }

    function doUnderlayHeight() {
        var D = document;
        return Math.max(
            D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        );
    }

    function doModalSize(o) {
        // Find out how many columns there are, create array of heights
        o.helpColsTotal = 0;
        for (o.i = 0; o.i < o.helpLists.length; o.i += 1) {
            if (o.helpLists[o.i].className.indexOf('help-list') !== -1) {
                o.helpColsTotal += 1;
            }
            o.helpListsHeights[o.i] = o.helpLists[o.i].offsetHeight;
        }

        // get the tallest column from the array of heights
        o.maxHeight = Math.max.apply(Math, o.helpListsHeights);

        // Quasi-responsive
        if (getWindowWidth() <= 1180 && getWindowWidth() > 630 && o.helpColsTotal > 2) {
            o.helpColsTotal = 2;
            o.maxHeight = o.maxHeight * o.helpColsTotal;
        }

        if (getWindowWidth() <= 630) {
            o.maxHeight = o.maxHeight * o.helpColsTotal;
            o.helpColsTotal = 1;
        }

        // Change the width/height of the modal and wrapper to fit the columns
        // Sorry for the magic numbers. Whatevs.
        o.helpListWrap.style.offsetWidth = (o.helpList.offsetWidth * o.helpColsTotal) + 'px';
        o.helpListWrap.style.height = o.maxHeight + 'px';
        o.helpModal.style.width = (o.helpList.offsetWidth * o.helpColsTotal) + 60 + 'px';
        o.helpModal.style.height = o.maxHeight + 100 + 'px';
    }

    function doWhichKey(e) {
        e = e || window.event;
        var charCode = e.keyCode || e.which;
        //Line below not needed, but you can read the key with it
        //var charStr = String.fromCharCode(charCode);
        return charCode;
    }

    // Primary function, called in checkServerResponse()
    function doQuestionMark() {

        var helpUnderlay = document.getElementById('helpUnderlay'),
            helpModal = document.getElementById('helpModal'),
            helpClose = document.getElementById('helpClose'),
            timeOut = null,
            objDoSize = {
                i: null,
                maxHeight: null,
                helpListWrap: document.getElementById('helpListWrap'),
                helpList: document.querySelector('.help-list'),
                helpLists: document.querySelectorAll('.help-list'),
                helpModal: helpModal,
                helpColsTotal: null,
                helpListsHeights: []
            },
            classCol;

        doModalSize(objDoSize);

        document.addEventListener('keypress', function (e) {

            // 63 = '?' key
            // '?' key toggles the modal
            if (doWhichKey(e) === 63) {
                classCol = document.getElementById('helpUnderlay').className;
                if (classCol.indexOf('help-isVisible') === -1) {
                    document.getElementById('helpUnderlay').className += ' help-isVisible';
                }

            }

            helpUnderlay.style.height = doUnderlayHeight() + 'px';

        }, false);

        document.addEventListener('keyup', function (e) {
            // 27 = ESC key
            if (doWhichKey(e) === 27) {
                removeModal(helpUnderlay);
            }
        }, false);

        // Modal is removed if the background is clicked
        helpUnderlay.addEventListener('click', function () {
            removeModal(helpUnderlay);
        }, false);

        // this prevents click on modal from removing the modal
        helpModal.addEventListener('click', function (e) {
            e.stopPropagation();
        }, false);

        // the close button
        helpClose.addEventListener('click', function () {
            removeModal(helpUnderlay);
        }, false);

        // If the window is resized, the doModalSize() function is called again.
        // If your menu includes only a single column of keyboard shortcuts,
        // then you won't need this. Keep only if you have 2 columns or more.
        // window.onresize = function () {
        //     if (timeOut !== null) {
        //         clearTimeout(timeOut);
        //     }
        //     timeOut = setTimeout(function () {
        //         doModalSize(objDoSize);
        //     }, 100);
        // };

    }

    // All the Ajax stuff is below.
    // Probably no reason to touch this unless you can optimize it.
    function getXhrObject() {
        var xhrObject = false;
        // All browsers (except IE6) use the 3 lines below
        if (window.XMLHttpRequest) {
            xhrObject = new XMLHttpRequest();
        }
        // If you need IE6 support, uncomment the following else/if:
        /*else if (window.ActiveXObject) {
            try {
                    xhrObject = new ActiveXObject("Msxml2.XMLHTTP");
                } catch(err) {
                    try {
                        xhrObject = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch(err) {
                        xhrObject = false;
                    }
            }
        }*/
        return xhrObject;
    }

    doQuestionMark();

}());
