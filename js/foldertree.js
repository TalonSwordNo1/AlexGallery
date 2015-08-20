var fsutil = require("./js/fsutil");
var _ = require("lodash");
(function() {
	app.controller('AbnController', function($scope, $timeout) {
		$scope.my_data = [];
		$scope.my_tree = tree = {};
		function createData(items) {
			var dirs = [];
			var images = [];
			_.forEach(items, function (item) {
				if(item.name.indexOf(".") != 0 && (item.isDir)) {
					dirs.push({
						label: item.name,
						noLeaf: item.isDir,
						data : {
							path : $scope.currentPath,
							isLoaded : false
						}
					})
				}
				if(!item.isDir && /\.(png|jpg|gif)$/gi.test(item.name)){
					item.path = $scope.currentPath;
					images.push(item)
				}
			});

			return { dirs : dirs.sort(function (item1, item2) {
				if(item1.noLeaf == item2.noLeaf){
					return item1.label > item2.label ? 1 : -1;
				}else if(item1.noLeaf){
					return 1;
				}else{
					return -1;
				}
			}), images : images};
		}
		$scope.treeClick = function() {
			var branch = tree.get_selected_branch();
			var data = branch.data;
			var path = data.path + (/\/$/.test(data.path) ? "" : "/") + branch.label;
			$scope.currentPath = path;
			$scope.$emit("showPath", $scope.currentPath);
			if(!data.isLoaded/* && data.path && branch.noLeaf*/){
				showBranch(branch);
			}else if(branch.noLeaf){
				if(!branch.expanded) {
					tree.expand_branch();
				}else{
					tree.collapse_branch();
				}
				if(branch.images){
					$scope.showImages(branch.images);
				}
			}else{
				$scope.preview = "file://" + path;
			}
		};
		$scope.showImages = function (images) {
			$scope.$emit("showImage", images);
		}
		function showBranch(branch) {
			$scope.processing = true;
			$scope.currentBranch = branch;
			$timeout(function() {
				fsutil.getFiles($scope.currentPath, function (files) {
					var data = createData(files);
					branch.children = data.dirs;
					if($scope.my_data.length == 0){
						$scope.my_data = data.dirs;
					}
					$timeout(function() {
						tree.expand_branch(branch);
					});
					branch.data.isLoaded = true;
					branch.images = data.images;
					$scope.showImages(data.images);
					$scope.processing = false;
				});
				$scope.doing_async = false;
			});

		}

		$scope.$on("refresh", function (event, msg) {
			$scope.$emit("showPath", $scope.currentPath);
			showBranch($scope.currentBranch);
		});
		$scope.init = function() {
			$scope.my_data = [];
			$scope.doing_async = true;
			var root = {
				label: "/",
				noLeaf: true,
				data : {
					path : "/",
					isLoaded : false
					}
				};
			$scope.currentPath = "/";
			showBranch(root);
		};
		$scope.init();
	});

}).call(this);