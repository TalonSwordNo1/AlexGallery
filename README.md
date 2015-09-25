![screenshot1](https://raw.githubusercontent.com/hcnode/AlexGallery/master/screenshots/screenshot1.png)

[中文版README](http://hcnode.github.io/2015/08/21/alexgallery/)

# Overview

AlexGallery is an application of images gallery and image processing which can browse local images and photos.
actually AlexGallery is a web application, because it is built by pure html.
but it is wrap by [nw](https://github.com/nwjs/nw.js), so it became a desktop application!


## Features

 - Local folder browser, list folders in tree view
 - When choose a folder, thumbnails of images under the folder show, and with two size mode small and large.
 - Batch images with batch manipulates including resize, lighten, and with three resize modes
 - Image gallery slider mode
 - Image processing, you can resize, crop, rotate, set effects (lighten, darken, blur, sharpen ...)

## About lwip

[lwip](https://github.com/EyalAr/lwip) is an awesome library, I have no idea to make an image app until I read it.
thanks [lwip](https://github.com/EyalAr/lwip) and the author [Eyal Arubas](https://github.com/EyalAr)

# Usage
**run source code with nw**
 - assume you have install [nw](https://github.com/nwjs/nw.js) and [bower](https://github.com/bower/bower),
 if not then run `npm install nw bower -g`
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

**download app package(Mac only)**
 - [download](https://github.com/hcnode/AlexGallery/releases/download/AlexGallery-v1.0.0/AlexGallery.zip) the package
 - unzip the zip file
 - launch the app

# build

`npm install nwbuild -g`

`nwbuild -p osx64 -v v0.12.3 -f /path/to/app`


# Notice
 - the app only run in Mac so far, and work fine with my Mac, so I am not sure if it work ok in windows as well
 - the app will create folder $HOME/AlexGallery to store thumbnail of the images you explore, and nothing else will do with you pc
 - when first time enter an images folder, there will generate thumbnail of the images by size max 200px, and save them to the
 $HOME/AlexGallery/thumb which mention above, so it will need some time to show the thumbnails at the first time you enter the folder

# Screenshots
![screenshot1](https://raw.githubusercontent.com/hcnode/AlexGallery/master/screenshots/screenshot1.png)
![screenshot2](https://raw.githubusercontent.com/hcnode/AlexGallery/master/screenshots/screenshot2.png)
![screenshot3](https://raw.githubusercontent.com/hcnode/AlexGallery/master/screenshots/screenshot3.png)
![screenshot4](https://raw.githubusercontent.com/hcnode/AlexGallery/master/screenshots/screenshot4.png)
![screenshot5](https://raw.githubusercontent.com/hcnode/AlexGallery/master/screenshots/screenshot5.png)

# Libraries dependencies
 - [lwip](https://github.com/EyalAr/lwip) Light Weight Image Processor for NodeJS
 - [angular-bootstrap-nav-tree](https://github.com/nickperkinslondon/angular-bootstrap-nav-tree) An AngularJS directive that creates a Tree based on a Bootstrap "nav" list.
 - [ngGallery](https://github.com/jkuri/ngGallery) AngularJS Image Gallery Slideshow
 - [cropper](https://github.com/fengyuanchen/cropper) A simple jQuery image cropping plugin.
 - [seiyria-bootstrap-slider](https://github.com/seiyria/bootstrap-slider) A complete rewrite of the original bootstrap-slider by Stefan Petre.
 - [font-awesome](https://github.com/FortAwesome/Font-Awesome) The iconic font and CSS toolkit

# About AlexGallery
 As you know, images tools in Mac sucks, so I make this app and name it by my newborn boy's name.

