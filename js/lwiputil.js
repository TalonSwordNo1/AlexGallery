var fs = require("fs-extra");
var lwip = require("lwip");
var fsutil = require("./fsutil");

module.exports = {
	crop : function(preImageUrl, param, defer){
		var that = this;
		that.open(preImageUrl, defer, function(err, image){
			image.crop(param.left, param.top, param.right, param.bottom, function (err, image) {
				that.save(err, image, preImageUrl, defer);
			})
		});
	},
	rotate : function(preImageUrl, degs, defer){
		var that = this;
		that.open(preImageUrl, defer, function(err, image){
			image.rotate(degs, function (err, image) {
				that.save(err, image, preImageUrl, defer);
			})
		});
	},
	resize : function(preImageUrl, width, height, defer){
		var that = this;
		that.open(preImageUrl, defer, function(err, image){
			image.resize(width - 0, height - 0, "lanczos",  function (err, image) {
				that.save(err, image, preImageUrl, defer);
			})
		});
	},
	effect : function(preImageUrl, effectType, value, defer){
		var that = this;
		that.open(preImageUrl, defer, function(err, image){
			console.log(effectType + ":" + value);
			image[effectType](value - 0,  function (err, image) {
				that.save(err, image, preImageUrl, defer);
			})
		});
	},
	open : function (preImageUrl, defer, cb) {
		//preImageUrl = this.getPreview(preImageUrl);
		lwip.open(preImageUrl, function(err, image){
			if(err){
				defer.reject(err);
			}else {
				cb(err, image);
			}
		});
	},
	save : function (err, image, preImageUrl, defer) {
		if(err){
			defer.reject(err);
		}else {
			preImageUrl = this.getPreview(preImageUrl, false);
			image.writeFile(preImageUrl, function (err) {
				if (err) {
					defer.reject(err);
				} else {
					defer.resolve(preImageUrl);
				}
			});
		}
	},
	getPreview : function (imageUrl, cp) {
		var fileName = new Date().valueOf() + "." +  (/\.([^\.]+)$/.test(imageUrl) && RegExp.$1);
		var preview = fsutil.getPreviewPath() + fileName;
		cp && fs.copySync(imageUrl, preview);
		return preview;
	}
};
