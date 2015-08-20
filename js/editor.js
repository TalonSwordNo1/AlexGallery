var edit = require("./js/lwiputil");
var fs = require("fs-extra");
var q = require("q");
var deps = [];


if (angular.version.full.indexOf("1.2") >= 0) {
	deps.push('ngAnimate');
}
var app = angular.module("editorApp", deps).controller("editorCtr",
	function ($scope, $timeout) {
		var url = purl();
		var imageEdit = decodeURIComponent(url.param("image")).substr(7);

		var image;
		function initImage(setMoveMode) {
			image = $('.img-container > img');
			image.cropper({
				preview:".img-preview",
				autoCrop : false,
				strict : false,
				touchDragZoom : false,
				mouseWheelZoom : false,
				built: function(data) {
					resetSize();
					if(setMoveMode || $scope.currentMode == "move") {
						$scope.action.setMoveMode();
					}
				}
			});
		}
		$(document).keydown(function () {
			if ( event.which == 27 && $scope.currentMode == "crop") {
				$timeout(function () {
					$scope.action.setMoveMode();
				})
			}
		});
		function resetSize() {
			$timeout(function () {
				var data = image.cropper('getCanvasData');
				var imageData = image.cropper('getImageData');
				if(data.width > imageData.naturalWidth) {
					data.width = imageData.naturalWidth;
					data.height = imageData.naturalHeight;
					image.cropper('setCanvasData', data);
				}
			});
		}

		function createImagePreview(preview, setMoveMode) {
			$(".img-container").html('<img src="file://'+ preview +'" alt="Picture">');
			initImage(setMoveMode);
		}

		$scope.origin = imageEdit;
		$scope.crop = function () {
			var data = image.cropper('getData');
			var left = data.x;
			var top = data.y;
			var right = left + data.width;
			var bottom = top + data.height;
			$scope.promise(function(defer) {
				if(left == 0 && top == 0 && right == 0 && bottom == 0){
					defer.reject("请选择区域");
				}else {
					edit.crop($scope.preview, {
						left: left,
						top: top,
						right: right,
						bottom: bottom
					}, defer)
				}
			});
		};
		$scope.rotate = function (ratio) {
			$scope.promise(function(defer) {
				edit.rotate($scope.preview, ratio, defer)
			});
		};
		$scope.resize = function (ratio) {
			$scope.promise(function(defer) {
				edit.resize($scope.preview, $scope.resizeWidth, $scope.resizeHeight, defer)
			});
		};
		$scope.promise = function(func){
			$scope.processing = true;
			var defer = q.defer();
			$timeout(function() {
				func(defer);
			});
			defer.promise.then(function (preview) {
				$timeout(function () {
					$scope.preview = preview;
					createImagePreview($scope.preview);
				})
			}, function (err) {
				$timeout(function () {
					$scope.err = err;
					$timeout(function () {
						$scope.err = null;
					}, 3000)
				});
			}).fin(function () {
				$timeout(function () {
					$scope.processing = false;
				})
			});
			return defer.promise;
		};
		$scope.currentMode = null;
		function getRatio() {
			var data = image.cropper('getImageData');
			return data.naturalWidth / data.naturalHeight;
		}

		$scope.action = {
			setMoveMode : function () {
				image.cropper('setDragMode', 'move');
				image.cropper('clear');
				$scope.currentMode = "move";
			},
			setCropMode : function () {
				image.cropper('setDragMode', 'crop');
				$scope.currentMode = "crop";
			},
			zoom : function (ratio) {
				image.cropper('zoom', ratio)
				$scope.currentMode = "zoom";
				$scope.zoomType = ratio > 0 ? "in" : "out";
			},
			rotate : function (ratio) {
				$scope.rotate(ratio);
				$scope.currentMode = "rotate";
				$scope.rotateType = ratio > 0 ? "right" : "left";
			},
			resize : function () {
				$scope.currentMode = "resize";
				$scope.ratioResize = true;
				var data = image.cropper('getImageData');
				$scope.resizeWidth = data.naturalWidth;
				$scope.resizeHeight = data.naturalHeight;
			},
			resizeCalHeight : function () {
				if($scope.ratioResize){
					var ratio = getRatio();
					$scope.resizeHeight = Math.round($scope.resizeWidth / ratio);
				}
			},
			resizeCalWidth : function () {
				if($scope.ratioResize){
					var ratio = getRatio();
					$scope.resizeWidth = Math.round($scope.resizeHeight * ratio);
				}
			},
			setEffect : function(effect){
				var config = effectConfig[effect];
				var range = config.range;
				var def = config.def;
				$scope.currentMode = "effect";
				$scope.effectType = effect;
				createSlider(range[0], range[1], def);
			},
			reset : function(){
				$scope.preview = edit.getPreview(imageEdit, true);
				createImagePreview($scope.preview, true);
			},
			save : function(){
				$("#txtSaveAs").attr("nwsaveas", /\/([^\/]+)$/.test(imageEdit) && RegExp.$1);
				$("#txtSaveAs").click();
				$("#txtSaveAs").on("change", function () {
					var file = $("#txtSaveAs").val();
					if(file) {
						if (!/\.[^\/]+$/.test(file)) {
							file += /(\.[^\.]+)$/.test(imageEdit) && RegExp.$1;
						}
						if(fs.existsSync(file)){
							fs.unlinkSync(file);
						}
						fs.copy($scope.preview, file, function (err) {
							$timeout(function () {
								if(err){
									$scope.err = err;
								}else{
									$scope.msg = "Save.";
									$timeout(function () {
										$scope.msg = null;
									}, 3000);
								}
							});
						});
					}
				})
			}
		};
		$scope.effect = function (value) {
			$scope.promise(function(defer) {
				edit.effect($scope.preview, $scope.effectType, value, defer)
			});
		};
		var effectConfig = {
			blur : {
				range : [0, 20],
				def : 0
			},
			sharpen: {
				range : [0, 20],
				def : 0
			},
			lighten: {
				range : [-1, 1],
				def : 0
			},
			darken: {
				range : [-1, 1],
				def : 0
			},
			fade: {
				range : [0, 1],
				def : 0
			},
			saturate: {
				range : [-1, 1],
				def : 0
			},
			hue: {
				range : [0, 100],
				def : 0
			}
		};
		var slider = null;
		function createSlider(min, max, def){
			$scope.effectValue = def;
			slider && slider.destroy();
			slider = new Slider('#sliderEffect', {
				step: (max - min) / 100,
				min: min,
				max: max,
				value : def
			});
			slider.on("slideStop", function (value) {
				$scope.effectValue = value;
				$scope.effect(value);
			});
		}
		$scope.action.reset();
	}
);