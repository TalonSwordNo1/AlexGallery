var fs = require("fs-extra");
var _ = require("lodash");
module.exports = {
	getUserHome : function() {
		return process.env.HOME || process.env.USERPROFILE;
	},
	getPath : function (type) {
		var homePath = this.getUserHome() + "/AlexGallery/";
		if(!fs.existsSync(homePath)){
			fs.mkdirSync(homePath);
		}
		var sub = homePath + type + "/";
		if(!fs.existsSync(sub)){
			fs.mkdirSync(sub);
		}
		return sub;
	},
	getThumbPath : function () {
		return this.getPath("thumb");
	},
	getPreviewPath : function () {
		return this.getPath("preview");
	},
	getFiles : function(root, cb){
		root = root || "/";
		var result = [];
		fs.readdir(root, function (err, files) {
			_.forEach(files, function (file) {
				var item = {};
				item.name = file;
				result.push(item);

				var stat = fs.statSync((root=="/" ? "" : root) + '/' + file);
				if (stat.isDirectory()) {
					item.isDir = true;
				}

			});
			cb(result);
		});
	},
	getOutput : function (item) {
		var file = item.path + "/" + item.name;
		return this.getThumbPath() + file.replace(/\//gi, "_");
	},
	createThumb : function (item, cb) {

		var file = item.path + "/" + item.name;
		var output = this.getOutput(item);
		this.resize(file, output, 200, "height", null, cb);
	},
	resize : function(file, output, ratioOrSize, side, batchCall, cb){
		var result = {
			output : output
		};

		if(!fs.existsSync(output)) {
			require('lwip').open(file, function (err, image) {
				if(err){
					console.log("read:" + JSON.stringify(err));
				}
				if(image) {
					var ratio;
					if(ratioOrSize > 1){
						ratio = ratioOrSize / (side == "height" ? image.height() : side == "width" ? image.width() :
												side == "longerSide" ? Math.max(image.height(), image.width()) : 1);
					}else{
						ratio = ratioOrSize;
					}
					ratio = ratio < 1 ? ratio : 1;

					image = image.batch()
						.scale(ratio);
					batchCall && (image = batchCall(image));
					image.writeFile(output, function (err) {
							if (err) {
								console.log("scale:" + JSON.stringify(err));
								result.err = true;
							}
							cb(result);
						});
				}else{
					result.err = true;
					cb(result);
				}
			});
		}else{
			cb(result);
		}
	},
	batch : function (param) {
		var items = param.items;
		var value = param.value;
		var side = param.side;
		var lightenRatio = param.lightenRatio;
		var onProgress = param.onProgress;
		var onFinish = param.onFinish;
		var outputPrefix = param.outputPrefix;
		var that = this;
		var i = 0;
		(function (item) {
			var callee = arguments.callee;
			var file = item.path + "/" + item.name;
			var output = item.path + "/"+ outputPrefix +"_" + item.name;

			that.resize(file, output, value, side, function (image) {
				return image.lighten(lightenRatio);
			}, function (result) {
				i ++ ;
				if(i < items.length){
					onProgress(i, items[i]);
					callee.call(this, items[i]);
				}else{
					onFinish();
				}
			});
		})(items[i]);
	}
};