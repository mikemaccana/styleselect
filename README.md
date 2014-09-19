# Style Select

Simple, standalone styling for select boxes in modern browsers.

Does not require jQuery, or any other dependencies.

## Demo

There's a live demop if the code in this repo. Just run `http-server` (or whatever your preferred static webserver is) in the current directory.

## Usage:

### SASS

Include `styleselect.scss` in your project.

### JS

Style Select is a require/AMD module:

  var styleSelect = require('styleSelect');

To style a select box:

  styleSelect(selector);

Whwere `selector` is a CSS selector.

That's all. From then on you'll probably want to tweak styling.

## Credit

Style Select is based on [VisualSelect](https://github.com/LeslieOA/VisualSelect), created for Multplx Attract platform.

Style select adds standalone functionality, lots of bugfixes, docs and a demo, the license has also been changed from WTFPL to the MIT license.