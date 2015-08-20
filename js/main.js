var deps = ['angularBootstrapNavTree','jkuri.gallery'];

if (angular.version.full.indexOf("1.2") >= 0) {
	deps.push('ngAnimate');
}
var app = angular.module("app", deps).controller("parentCtr",
	function ($scope, $timeout) {
		function resize(items, path) {
			$scope.total = items.length;
			if($scope.total > 0) {
				var clone = require("lodash").clone(items);
				var i = 0;
				(function (item) {
					var callee = arguments.callee;
					i++;
					require("./js/fsutil").createThumb(item, function (result) {
						$timeout(function () {
							var thumbPath = result.output;
							if (!result.err) {
								var image = {
									thumb: thumbPath,
									img: item.path + "/" + item.name,
									description: item.name
								};

								$scope.progress = Math.round(i / items.length * 100);
								if ($scope.progress >= 100) $scope.progress = false;
								$scope.current = i;
								$scope.$broadcast("showImageFromParent", image);
							}
							if ((clone.length > 0 && path == $scope.currentPath) && !$scope.batchProcessing) {
								callee.call(this, clone.shift());
							}
						});
					});

				})(clone.shift());
			}
		}
		$scope.$on("showImage",
			function (event, msg) {
				$scope.progress = 0;
				$scope.currItems = msg;
				$timeout(function () {
					resize(msg, $scope.currentPath);
				});
			});
		$scope.$on("showPath",
			function (event, msg) {
				$scope.currentPath = msg;
				$scope.$broadcast("cleanImage", msg);
			});

		$scope.getPaths = function () {
			return ($scope.currentPath && $scope.currentPath.split("/") || ["/"]);
		};
		$scope.batch = function () {
			var items = $scope.currItems;
			var width = $scope.batchWidth;
			var height = $scope.batchHeight;
			var longerSize = $scope.batchLongerSize;
			var lightenRatio = sliderLighten.getValue();
			var sizeRatio = sliderSizeRatio.getValue();
			var value;
			var side;
			switch ($scope.optionsResizeType - 0){
				case 0:
					value = sizeRatio;
					break;
				case 1:
					value = width || height;
					side = width ? "width" : "height";
					break;
				case 2:
					value = longerSize;
					side = "longerSide";
					break;
			}
			console.log(value + "");
			console.log(width + "");
			console.log($scope.optionsResizeType + "");

			require("./js/fsutil").batch({
				items : items,
				value : value,
				side : side,
				lightenRatio : lightenRatio,
				outputPrefix : $scope.outputPrefix || "hcnode",
				onProgress : function (i, item){
					$timeout(function () {
						$scope.batchProgress = i;
					});
				},
				onFinish : function () {
					$timeout(function () {
						$scope.processing = false;
					});
				}
			});
			$scope.processing = true;
			$scope.batchTotal = items.length;
		}
		$scope.inputSizeChange = function (type) {
			if(type == "width" && $scope.batchWidth != ""){
				$scope.batchHeight = "";
			}
			if(type == "height" && $scope.batchHeight != ""){
				$scope.batchWidth = "";
			}
		};
		$scope.refresh = function () {
			$scope.$broadcast("refresh", null);
		};
		var sliderLighten;
		function createSlider(min, max, def){
			sliderLighten && sliderLighten.destroy();
			sliderLighten = new Slider('#sliderEffect', {
				step: (max - min) / 100,
				min: min,
				max: max,
				value : def
			});
		}
		var sliderSizeRatio;
		function createSliderSizeRatio(min, max, def){
			sliderSizeRatio && sliderSizeRatio.destroy();
			sliderSizeRatio = new Slider('#sliderSizeRatio', {
				step: (max - min) / 100,
				min: min,
				max: max,
				value : def
			});
		}
		$scope.optionsResizeType = 0;
		$scope.outputPrefix = "hcnode";
		createSlider(-1, 1, 0);
		createSliderSizeRatio(0, 1, 1);
	});