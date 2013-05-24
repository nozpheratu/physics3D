#WebGL - Three.js + impactJS#

The main/non-core (files to pay attention to) files for this demo are:

* [lib/three.js/main.js](lib/three.js/main.js) - orchestrates all the three.js stuff and bridges the gap between Impact + three.js
* [lib/three.js/jetpackFlame.js](lib/three.js/jetpackFlame.js) - jetpack effects
* [lib/impact-wrapper.js](lib/impact-wrapper.js) - generates and stores the required 3D meshes for all Impact entities

All credit for this demo goes to **Christian Östman** and **Richard Åström**, see http://asmallgame.com/labsopen/webgl_impact/ for a more functional demo.

#Setup#
Some files were ommited for the purposes of making this code public. To make this demo work you'll need to add the following folders/files:
* lib/impact/
* optional impact files:
  * lib/weltmeister/
  * tools/
  * weltmeister.html


