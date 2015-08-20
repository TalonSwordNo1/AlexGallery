var _ = require("lodash");
app.controller('CtrlGallery', function($scope, $timeout) {
	var that = this;
	that.images = [];
	$scope.$on("showImageFromParent", function (event, msg) {
		that.images.push(msg);
	});
	$scope.$on("cleanImage", function (event, msg) {
		that.images = [];
	});

});