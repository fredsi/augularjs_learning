angular.module('todoApp',[]).controller('todoController', function($scope, $filter, todoStorage){
	var items = $scope.items = todoStorage.get('todo');
	$scope.showItems = items;
	var markIndex = $scope.markIndex = -1;
	var isEditable = $scope.isEditable = false;
	$scope.markLabel = 'All';
	$scope.currentIndex = -1;

	$scope.$watch('items', function(oldValue, newValue, scope){
		todoStorage.put('todo', items);
		$scope.activeCount = $filter('filter')(items, {status: false}).length;
		$scope.wholeStatus = $scope.activeCount == 0;
		$scope.show = items.length > 0;
		$scope.showClear = items.length > $scope.activeCount;
		$scope.showTasks($scope.markLabel);
	}, true);

	$scope.addTask = function(e){
		var keyCode = window.event?e.keyCode:e.which;
		if(keyCode == 13){
			if($scope.newTask == '' || $scope.newTask == null)
			{
				return;
			}
			var task = $scope.newTask.trim();
			var item = {
				'task': task,
				'status': false
			};
			if ($scope.markLabel == 'Active'){
				items.push(item);
				$scope.showItems.push(item);
			}else{
				items.push(item);
			}
			$scope.items = items;
			$scope.newTask = '';
		}
	};

	$scope.removeTask = function(item){
		items.splice(items.indexOf(item), 1);
		if($scope.markLabel != 'All'){
			$scope.showItems.splice($scope.showItems.indexOf(item), 1);
		}
		$scope.items = items;
    };

    $scope.editTask = function(event, item, str){
    	var isBlur = str == 'blur' && $scope.isEditable;
    	var isKeyup = str == 'keyup' && $scope.isEditable;
    	var isEnter = window.event?event.keyCode:event.which;
    	if ((isBlur || (isKeyup && isEnter == 13)) && item.task.length > 0){
    		var task = item.task.trim();
    		items[markIndex].task = task;
    		$scope.isEditable = false;
    		$scope.currentIndex = -1;
    	}else if ((isBlur || (isKeyup && isEnter == 13)) && item.task.trim() == ''){
    		if($scope.markLabel != 'All'){
    			$scope.showItems.splice($scope.showItems.indexOf(item), 1);
    		}
    		items.splice(items.indexOf(item), 1);
    		$scope.isEditable = false;
    		$scope.currentIndex = -1;
    	}
    };

    $scope.changeEditable = function(target, item){
    	markIndex = items.indexOf(item);
    	$scope.isEditable = true;
    	$scope.currentIndex = $scope.showItems.indexOf(item);
    };

	$scope.changeAllStatus = function(){
		angular.forEach(items, function(item, index){
			item.status = !$scope.wholeStatus;
		});
		$scope.items = items;
	};

	$scope.showTasks = function(state){
		var newItems = '[]';
		$scope.markLabel = state;
		if(state == 'Active'){
			newItems = $filter('filter')(items, {status: false});
		}else if(state == 'Completed'){
			newItems = $filter('filter')(items, {status: true});
		}else{
			newItems = items;
		}
		$scope.showItems = newItems;
	};

	$scope.clearCompleted = function(){
		var newItems = $filter('filter')($scope.items, {status: true});
		angular.forEach(newItems, function(item){
			items.splice(items.indexOf(item), 1);
		});
		$scope.markLabel = 'All';
	};
});

