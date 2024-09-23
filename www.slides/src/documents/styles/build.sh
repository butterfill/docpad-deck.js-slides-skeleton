#! /bin/bash

echo "you might need to install"
echo "npm i -g stylus"
echo "npm i -g nib"
echo "----"

stylus -u nib steve_deck_style.css.styl -o temp.css

cleancss temp.css -o steve_deck_style.css


