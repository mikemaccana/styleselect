# Style Select

## Full styling for select boxes. No jQuery.

 - **Standalone** - runs on its own without any dependencies. If you're using vanilla JS and want to style a select box, you've come to the right place.
 - **Correct** - Triggers 'change' events on real select boxes so you won't have to modify your existing event listeners.
 - **Usable with the keyboard** - Appears in tab index, space shows and hides the options, up and down arrow changes the highlight option, enter selects the currently highlighted option.
 - **Stylable** - designed for easy incorporation into your own look and feel. SCSS, free of magic numbers, CSS 'triangles', images, and other hacks. 
 - **Accessable** - people using screen readers simply experience the regular, unstyled select box.

## Demo

There's a live demo at http://mikemaccana.github.io/styleselect/.

There's also a live demo of the code in this repo. Just run `http-server` (or whatever your preferred static webserver is) in the current directory.

Open the JavaScript console on the demo page for more instructions.

Note that since Android and iOS have specific touch-enabled features to ease their use on mobile, Style Select will not change select buttons on these platforms.

## Usage:

### SASS

Include `styleselect.scss` in your project.

### JS

#### Import module 

Style Select supports both AMD/require.js or npm/browserify modules:

For AMD/require.js users:

    define('styleselect', function(styleSelect){
        ...
    });

For npm/browserify users:

    var styleSelect = require('styleSelect');

#### Style a select box

To style a select box:

    styleSelect(selector);

Where `selector` is a CSS selector.

That's all. From then on you'll probably want to tweak styling.

## Credit

Style Select is based on [VisualSelect](https://github.com/LeslieOA/VisualSelect), created for Multplx Attract platform.

Style Select adds lots of bugfixes, new SASS, docs and a demo, the license has also been changed from WTFPL to the MIT license.
