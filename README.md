# AlexGallery
AlexGallery is a application of images gallery and image editor which explore local images and photos and edit them.
actually AlexGallery is a web application, because it is built by pure html.
but it is wrap by [nw](https://github.com/nwjs/nw.js), so it became a desktop application!

# Features
 - local folder explorer, list folders in tree view
 - when choose a folder, thumbnails of images under the folder show, and with two size mode small and large.
 - Batch images with batch manipulates including resize, lighten, and with three resize modes
 - Image preview mode
 - Image editor, you can resize, crop, rotate, set effects (lighten, darken, blur, sharpen ...)

# Why use [nw](https://github.com/nwjs/nw.js)?
when explore or edit local images, it used to use file system library to read or write the image files,
and we can use node.js fs module to accomplish, and nw make node.js and html into desktop application, it is cool and that is why I use nw.

# Usage
 
 - suppose you have install [nw](https://github.com/nwjs/nw.js) and [bower](https://github.com/bower/bower), if not then run `npm install nw bower -g`
 - clone Repo `git clone https://github.com/hcnode/AlexGallery` and `cd AlexGallery`
 - install node.js dependencies
`npm install`
 - install browser dependencies
`bower install`
 - **during npm install, library [lwip](https://github.com/EyalAr/lwip) install with node-gyp to build native modules,
 it work fine in node.js without nw, but with nw, we need to build with [nw-gyp](https://github.com/nwjs/nw-gyp) manually**
	 - install nw-gyp `npm install nw-gyp -g`
	 - go to the lwip library `cd node_module/lwip`
	 - generate build files `nw-gyp configure`
	 - build it `nw-gyp build`
 - back to root of app and run `nw` to launch the application

# Notice
 - the app only run in Mac so far, and work fine with my Mac, so I am not sure if it work ok in windows as well
 - the app will create folder $HOME/AlexGallery to store thumbnail of the images you explore

# Libraries dependencies
 - [lwip](https://github.com/EyalAr/lwip) Light Weight Image Processor for NodeJS 
 - [angular-bootstrap-nav-tree](https://github.com/nickperkinslondon/angular-bootstrap-nav-tree) An AngularJS directive that creates a Tree based on a Bootstrap "nav" list.
 - [ngGallery](https://github.com/jkuri/ngGallery) AngularJS Image Gallery Slideshow
 - [cropper](https://github.com/fengyuanchen/cropper) A simple jQuery image cropping plugin.
 - [seiyria-bootstrap-slider](https://github.com/seiyria/bootstrap-slider) A complete rewrite of the original bootstrap-slider by Stefan Petre.
 - [font-awesome](https://github.com/FortAwesome/Font-Awesome) The iconic font and CSS toolkit

# About AlexGallery
 As you know, images tools in Mac sucks, so I make this app and name it by my newborn boy's name.

