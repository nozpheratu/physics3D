#WebGL - Three.js + impactJS#

Note: This demo was updated to use three.js(v2013 04 17 - r58), the demo featured [here](http://asmallgame.com/labsopen/webgl_impact/) uses an earlier version.

***

*To my inexperienced understanding:*

The main/non-core (files to pay attention to) files for this demo are:

* [lib/three.js/main.js](lib/three.js/main.js) - orchestrates all the three.js stuff and bridges the gap between Impact + three.js
* [lib/three.js/jetpackFlame.js](lib/three.js/jetpackFlame.js) - jetpack effects
* [lib/impact-wrapper.js](lib/impact-wrapper.js) - generates and stores the required 3D meshes for all entities
* [models/](models/) - geometry/material json data used for Impact entities & level

All credit for this demo goes to **Christian Östman** and **Richard Åström**, see http://asmallgame.co/labsopen/webgl_impact/ for a more functional demo. Will remove or transfer ownership of this repo upon request.

#Setup#
This demo won't work out of the box as the core Impact files were ommited for the purposes of making this code public. To make this demo work you'll need to add the following folders/files:
* lib/impact/
* optional impact files:
  * lib/weltmeister/
  * tools/
  * weltmeister.html


