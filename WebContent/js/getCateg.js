var myModule = angular.module('olxApplication', ['ngRoute','ngCookies']);

/**
 * @param $scope
 * @param $http
 * @param $cookieStore
 * @returns
 */

function testController($rootScope,$scope,$http,$cookieStore,$location,$cookies) {
	$scope.products=[];
	$rootScope.adsList= [];
	$rootScope.noAdsList= [];
	$rootScope.info=[];
	
	$rootScope.account=[];
	$rootScope.msgs=[];
	 $scope.orders = ['Date Posted','Posted By','Title','Price'];
	
	$scope.uploadme;
	   function readURL(input) {
			 if (input.files && input.files[0]) {
			        var reader = new FileReader();

			        reader.onload = function (e) {
			            $('#image_upload_preview').attr('src', e.target.result);
			        }

			        reader.readAsDataURL(input.files[0]);
			  }
			}
				$("#inputFile").change(function () {
				    readURL(this);
				});
	$scope.isLogin=function(){
		if($cookieStore.get('auth-token'))
			return true;
		return false;
		}
				

	$scope.getAllCategories = function() {
		
		var url = 'http://10.20.14.83:9000/categories'; //'http://date.jsontest.com/';
		$http.get(url).success(function(data, status) {
		angular.forEach(data.data.itemList, function(value, key) {
					$scope.products.push(value);
			});
		});
		
	}
	$scope.getAllCategories();
	
	$scope.search = function(searchBox) {
			$http({
				method : 'GET',
				url : 'http://10.20.14.83:9000/posts/search/text?searchText='+searchBox,
				headers : {
					'Content-Type' : 'application/json',
					'Access-Control-Allow-Origin': 'http://localhost:9000',
				}
			}).then(function successCallback(response) {
				var data = response.data;
				if (data.data.advertiseList!= null) {
					var temp=[];
					temp = data.data.advertiseList;
					 $rootScope.noAdsList=[];
					angular.forEach(temp, function(value, key){
						var imgsrc= "data:image/png;base64,"+value.photos;
				        $rootScope.noAdsList.push({title:value.title,category:value.category,description:value.description,id:value.id,name:value.name,price:value.price,photo1:imgsrc});
				     });
				} else {
					$rootScope.noAdsList.push("No Ads found in this categ");
					$location.path=("#/");
				}		
			}, function errorCallback(response) {
				

			});
		$location.path("/search");
	}
	
	$scope.sortProducts= function(cate,prod) {
		
		$http({
			method : 'GET',
			url : 'http://10.20.14.83:9000/posts/search?sortBy='+prod+'&category='+cate,					// For post
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://localhost:9000',
			}
		}).then(function successCallback(response) {
			var data = response.data;
			if (data.data.advertiseList!= null) {
				var temp=[];
				temp = data.data.advertiseList;
				$rootScope.adsList=[];
				angular.forEach(temp, function(value, key){
					var imgsrc= "data:image/png;base64,"+value.photos;
			        $rootScope.adsList.push({title:value.title,category:value.category,description:value.description,id:value.id,userId:value.userId,name:value.name,price:value.price,photo1:imgsrc});
			       
			        $location.path("/ads");
				});
			} else {
				alert("SortNot Done");
			}		
		}, function errorCallback(response) {
			alert("Server Error. Try After Some time: " + response);

		});
	$location.path("/ads");
	}
	$scope.logout = function(product) {
		$cookieStore.remove('auth-token');
		$cookieStore.remove('userId');
		$location.path("#/");
	}
	$scope.showMsgs = function(id) {
		$scope.token=$cookieStore.get('auth-token');
		$http({
			method : 'GET',
			url : 'http://10.20.14.83:9000/posts',					// For post
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://localhost:9000',
				'auth-token':$scope.token								// Take from session
			}
		}).then(function successCallback(response) {
			var data = response.data;
			if (data.data.mypostList!= null) {
				for(var i=0;i<data.data.mypostList.length;i++){
					$rootScope.msgs.push(data.data.mypostList[i].replies);
				}
				console.log($rootScope.msgs);
			} else {
				$rootScope.msgs = data.data.mypostList.replies;
				$location.path=("#/");
			}		
		}, function errorCallback(response) {
			alert("Server Error. Try After Some time: " + response);

		});
	$location.path("/account");
	}

	$scope.accountProduct = function() {
		$scope.token=$cookieStore.get('auth-token');
		var i=0;
		$http({
			method : 'GET',
			url : 'http://10.20.14.83:9000/posts',					// For post
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://localhost:9000',
				'auth-token':$scope.token								// Take from session
			}
		}).then(function successCallback(response) {
			var data = response.data;
			if (data.data.mypostList!= null) {
				$rootScope.account = data.data.mypostList;
			} else {
				$rootScope.account = data.data.mypostList;
				$location.path=("#/");
			}		
		}, function errorCallback(response) {
			alert("Server Error. Try After Some time: " + response);

		});
	$location.path("/account");
	}
	$scope.logout = function(product) {
		$cookieStore.remove('auth-token');
		$cookieStore.remove('userId');
		$location.path("#/");
	}
	
	
	$scope.edit= function(account) {
		var index = $scope.account.indexOf(account);
		$location.path('/edit/'+account.id+ "/"+account.title+ "/"+ account.name + "/" +account.price + "/" + account.category + "/" + account.description);
		
	}
	$scope.updateProduct = function() {  //UPDATE UPDATE UPDATE
		$scope.token=$cookieStore.get('auth-token');
		$http({
			method : 'PUT',
			url : 'http://10.20.14.83:9000/postAd',					// For post
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://localhost:9000',
				'auth-token':$scope.token								// Take from session
			},
			data : {
				
				"postId":$scope.id,
				"status": 'Open', 
				"title":  $scope.title, 
				"name":  $scope.name, 
				"category": $scope.category, 
				"description": $scope.description,
				"price" : $scope.price,
				"photoCount": 2, 
				"photo1": "",
				"photo2" : ""
				
				
				
			}
		}).then(function successCallback(response) {
			var data = response.data;
			if (true) {
				$scope.accountProduct();
			} else {
				$rootScope.account = data.data.mypostList;
				$location.path=("/account");
			}		
		}, function errorCallback(response) {
			alert("Server Error. Try After Some time: " + response);

		});
	$location.path("/account");
	}
	$scope.deletePost = function(product) {
		$scope.token=$cookieStore.get('auth-token');
		var i=0;
		$http({
			method : 'DELETE',
			url : 'http://10.20.14.83:9000/post?postId='+product,					// For post
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://localhost:9000',
				'auth-token':$scope.token
			}
		}).then(function successCallback(response) {
			var data = response.data;
			if (true) {
			
				$scope.accountProduct();
			} else{
				alert("Fail");
			}		
		}, function errorCallback(response) {
			alert("Server Error. Try After Some time: " + response);

		});
	}
	
	
	


	
	/* Details */
	
	$scope.details = function(product) {
		$scope.token=$cookieStore.get('auth-token');
		if($scope.isLogin()){
		var i=0;
		$http({
			method : 'GET',
			url : 'http://10.20.14.83:9000/viewAd?postId='+product,					// For post
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://localhost:9000',
				'auth-token':$scope.token								// Take from session
			}
		}).then(function successCallback(response) {
			var data = response.data;
			if (data.data.mypost!= null) {
				$rootScope.info = data.data.mypost;
			} else {
				alert("Fail");
				$location.path=("#/");
			}		
		}, function errorCallback(response) {
			alert("Server Error. Try After Some time: " + response);

		});
		$location.path("/details");
		}
		else
		{
			$location.path("/login");
		}

	}
	
	/* Ads of that user only account.html
	
	$scope.viewUserAds = function(product) {
		var i=0;
		$http({
			method : 'GET',
			url : 'http://10.20.14.83:9000/posts/search?category='+product.name,
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://localhost:9000'
			}
		}).then(function successCallback(response) {
			var data = response.data;
			if (data.data.advertiseList!= null) {
				$rootScope.adss = data.data.advertiseList;
				
			} else {
				alert("No Ads found in this categ");
				$location.path=("#/");
			}		
		}, function errorCallback(response) {
			alert("Server Error. Try After Some time: " + response);

		});
	$location.path("/userAds");
	}
	*/

	/*View particular Category Wise Ads*/
	
	$scope.viewAds = function(product) {
		$scope.token=$cookieStore.get('auth-token');
		var i=0;
		$http({
			method : 'GET',
			url : 'http://10.20.14.83:9000/posts/search?category='+product.name,
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://localhost:9000',
				'auth-token':$scope.token
			}
		}).then(function successCallback(response) {
			var data = response.data;
			if (data.data.advertiseList!= null) {
				var temp=[];
				temp = data.data.advertiseList;
				
				angular.forEach(temp, function(value, key){
					var imgsrc= "data:image/png;base64,"+value.photos;
			        $rootScope.adsList.push({title:value.title,category:value.category,description:value.description,id:value.id,userId:value.userId,name:value.name,price:value.price,photo1:imgsrc});
			     });
			} else {
				alert("No Ads found in this categ");
				$location.path=("#/");
			}		
		}, function errorCallback(response) {
			alert("Server Error. Try After Some time: " + response);

		});
	$location.path("/ads");
	}
	
	
	/*For Text Field*/
	$scope.login= function() {
		
		var _uname=$scope.uname;
		var _passwd=$scope.passwd;
		$http({
			method : 'POST',
			url : 'http://10.20.14.83:9000/login',
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://localhost:9000'
			},
			data : {
				userName : _uname,
				password : _passwd
			 }
		}).then(function successCallback(response) {
			var data = response.data;
			if (data.data['auth-token']!= null) {
			
				$cookieStore.put('auth-token',data.data['auth-token']);
				$cookieStore.put('userId',data.data.userId);
				$location.path("#/");
			
			} else {
				alert("Invalid Credentials");
			}		
		}, function errorCallback(response) {
			alert("Server Error. Try After Some time: " + response);

		});
	}
	
	$scope.message= function(prod) {
		$scope.token=$cookieStore.get('auth-token');
		$http({
			method : 'POST',
			url : 'http://10.20.14.83:9000/message',
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://localhost:9000',
				'auth-token':$scope.token
			},
			data : {
				message : $scope.msg,
				postId : prod.id
			 }
		}).then(function successCallback(response) {
			var data = response.data;
			if (data.data.userId!= null) {
				alert("Message Sent");
				$location.path("/details");
			} else {
				alert("Message Not Sent");
			}		
		}, function errorCallback(response) {
			alert("Server Error. Try After Some time: " + response);

		});
	}
	
	
	
	$scope.username = function(){
		return $cookieStore.get('userId');
	}
	
	$scope.adPost = function() {
				$scope.token=$cookieStore.get('auth-token');
		 		//the image
				//var bannerImage = document.getElementById('inputFile');
				var bannerImage=document.getElementById("image_upload_preview");
				//var dataURL = bannerImage.toDataURL();
				var imgData = getBase64Image(bannerImage);
				//localStorage.setItem("imgData", imgData);
				function getBase64Image(img) {
					 var canvas = document.createElement("canvas");
					 canvas.width = img.width;
					 canvas.height = img.height;
					 var ctx = canvas.getContext("2d");
					 ctx.drawImage(img, 0,0);
					 var dataURL = canvas.toDataURL("image/png");
					 return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
				}
				function readURL(input) {
				 if (input.files && input.files[0]) {
				        var reader = new FileReader();

				        reader.onload = function (e) {
				            $('#image_upload_preview').attr('src', e.target.result);
				        }

				        reader.readAsDataURL(input.files[0]);
				  }
				}
					$("#inputFile").change(function () {
					    readURL(this);
					});
					$http({
					method : 'POST',
					url : 'http://10.20.14.83:9000/postAd',
					headers : {
						'Content-Type' : 'application/json',
		                 'Access-Control-Allow-Origin': 'http://10.20.14.83:9000/',
						'auth-token':$scope.token
					},
					data : {
						title : $scope.title,
						name : $scope.name,
						category:$scope.category,
						description:$scope.description,
						photoCount:1,
						photo1:bannerImage,
						price:$scope.price
						
					}
				}).then(function successCallback(response) {
					var data = response.data;
					if (response.data.data.category != null) {
						$scope.accountProduct();
					} else {
						alert('product NOT created');
					}		
				}, function errorCallback(response) {
					alert("Server Error. Try After Some time: " + response);

				});
					
		}
	$scope.register= function() {
		$http({
			method : 'POST',
			url : 'http://10.20.14.83:9000/register',
			headers : {
				'Content-Type' : 'application/json',
				'Access-Control-Allow-Origin': 'http://localhost:9000'
			},
			data : {
			
				firstName: $scope.fname,
				lastName: $scope.lname,
				userName: $scope.mail,
				password: $scope.passwd,
				email: $scope.mail,
				phone: 7894561230
			}
		}).then(function successCallback(response) {
			var data = response.data;
			if (data.data.message!= null) {
				alert(data.data.message);
				$location.path("/");
			} else {
				alert("Registered Successfully");
			}		
		}, function errorCallback(response) {
			alert("Server Error. Try After Some time: " + response);

		});
	}
	
	
}
myModule.controller('TestController', testController);

myModule.config(function($routeProvider){
	$routeProvider
		.when('/', {
			controller: 'TestController',
			templateUrl: 'getCateg.html'
		})
		.when('/login', {
			controller: 'TestController',
			templateUrl: 'login.html'
		})
		.when('/account', {
			controller: 'TestController',
			templateUrl: 'account.html'
		})
		.when('/details', {
			controller: 'TestController',
			templateUrl: 'details.html'
		})
		.when('/ads', {
			controller: 'TestController',
			templateUrl: 'ads.html'
		})
		.when('/post', {
			controller: 'TestController',
			templateUrl: 'post.html'
		})
		.when('/search', {
			controller: 'TestController',
			templateUrl: 'search.html'
		})
		.when("/edit/:id/:title/:name/:price/:category/:description", {
			controller: function($scope,$routeParams) {
				$scope.id = $routeParams.id;
				$scope.title = $routeParams.title;
				$scope.name = $routeParams.name;
				$scope.category = $routeParams.category;
				$scope.price = $routeParams.price;
				$scope.description = $routeParams.description;
			},
			templateUrl: 'edit.html'
		})
		.otherwise({redirectTo: '/'})
});




