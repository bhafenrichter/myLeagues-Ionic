angular.module('app.controllers', [])
  
.controller('loginCtrl', function($scope, $state, AccountService, $rootScope, LeagueService, PopupService) {
    $scope.username = "bhafenri";
    $scope.password = "password";
    $scope.login = function(username,password){
        AccountService.login(username,password).then(function(data){
            if(data.id != ""){
                //get user data to be used in app
                LeagueService.getUserInformation(data.id).then(function(data){
                    $rootScope.user = data; 
                    $state.go("tabsController.leagueHome");  
                });
            }
        });
    };
})
   
.controller('createAccountCtrl', function($scope, AccountService, $q) {
    $scope.createAccount = function(username,password,email){
        AccountService.createAccount(username,password, email).then(function(data){
            if(data.id != ""){
                $state.go("tabsController.leagueHome");   
            }                                                               
        });
    }
})
      
.controller('leagueHomeCtrl', function($scope, LeagueService, $ionicModal, $rootScope, PopupService) {

    $ionicModal.fromTemplateUrl('templates/addGame.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.mainModal = modal
    })  

    $scope.openModal = function(isChooseUser) {
        if(!isChooseUser){
            $scope.mainModal.show();
        }else{
            
        }
        
    }

    $scope.closeModal = function(isChooseUser) {
        if(!isChooseUser){
            $scope.mainModal.hide();
        }else{
            
        }
        setTimeout($scope.resetModal, 500);
    };

    $scope.$on('$destroy', function(isChooseUser) {
        if(!isChooseUser){
            $scope.mainModal.remove();
        }else{
            
        }
        
    });
    
    //add game logic
    $scope.headlineTransition = function(){
        var main = angular.element(document.getElementById("score"));
        main.css("display","none");
        var headline = angular.element(document.getElementById("headline"));
        headline.css("display","");
        var mainButton = angular.element(document.getElementById("mainButton"));
        mainButton.css("display","none");
        var headlineButton = angular.element(document.getElementById("headlineButton"));
        headlineButton.css("display","");
    };
    
    $scope.userPickTransition = function(){
        var main = angular.element(document.getElementById("score"));
        main.css("display","none");
        var mainButton = angular.element(document.getElementById("mainButton"));
        mainButton.css("display","none");
        var userPick = angular.element(document.getElementById("userPick"));
        userPick.css("display","");
        
    };
    $scope.resetModal = function(){
        //show first modal
        var main = angular.element(document.getElementById("score"));
        main.css("display","");
        var mainButton = angular.element(document.getElementById("mainButton"));
        mainButton.css("display","");
        
        //hide headline modal
        var headline = angular.element(document.getElementById("headline"));
        headline.css("display","none");
        var headlineButton = angular.element(document.getElementById("headlineButton"));
        headlineButton.css("display","none");
        
        //hide user pick modal
        var userPick = angular.element(document.getElementById("userPick"));
        userPick.css("display","none");
        
        console.log("Reset Modal");
    };
    
    $scope.searchUsers = function(searchText){
        LeagueService.searchUserLeagues(searchText, "ngX2tFbJXt").then(function(data){
            $scope.searchedUsers = data;   
            $scope.$apply();
        });
    };
    
    $scope.selectedUser = function(user){
        $scope.opponent = user;
        $scope.resetModal();
        console.table($scope.opponent);
    }

    $scope.submitGame = function(){
        LeagueService.addGame($rootScope.leagueViewModel.user, 
                             $scope.opponent,
                             $scope.game.userScore,
                             $scope.game.opponentScore,
                             $scope.game.headlineText,
                             "ngX2tFbJXt",
                             null,
                             null).then(function(data){
            PopupService.messageDialog("Game has been posted!");
            $scope.mainModal.hide();
        });         
    }
    $scope.opponent = LeagueService.generateEmptyUser();
    $scope.game = {};
    $scope.post = {};
    //league wall logic
    $scope.postToWall = function(){
        LeagueService.postToWall("ha6b6pW4tu","ngX2tFbJXt", $scope.post.title, $scope.post.contents).then(function(data){
            //update the posts
            LeagueService.getLeaguePosts($rootScope.leagueViewModel.leagueid).then(function(data){
                $rootScope.leagueViewModel.posts = data;
                $scope.$apply();
            }); 
            
        });
    };
    
    $scope.getUser = function(id){
        for(var j = 0; j < $rootScope.leagueViewModel.standings.length; j++){
            if(id == $rootScope.leagueViewModel.standings[j].id){
                return $rootScope.leagueViewModel.standings[j];    
            }
        }
    }
})
   
.controller('recentGamesCtrl', function($scope, $rootScope, LeagueService) {
    
    $scope.getUser = function(id){
        for(var j = 0; j < $rootScope.leagueViewModel.standings.length; j++){
            if(id == $rootScope.leagueViewModel.standings[j].id){
                return $rootScope.leagueViewModel.standings[j];    
            }
        }
    }
})
   
.controller('leagueStandingsCtrl', function($scope, LeagueService, $ionicModal, $rootScope, PopupService) {       
    $ionicModal.fromTemplateUrl('contact-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal
    });
    
    $ionicModal.fromTemplateUrl('settings-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.settings = modal;
    });

    $scope.openModal = function(isSettings) {
        if(isSettings){
            $scope.settings.show();
        }else{
           $scope.modal.show(); 
        }
        
    }

    $scope.closeModal = function(isSettings) {
        if(isSettings){
            $scope.settings.hide();
        }else{
            $scope.modal.hide();
        }
        
    };

    $scope.$on('$destroy', function(isSettings) {
        $scope.modal.remove();
    });
    
    $scope.searchUsers = function(searchText){
        LeagueService.searchUsers(searchText).then(function(data){
            $scope.searchedUsers = data;   
            $scope.$apply();
        });
    };
    
    $scope.addUserToLeague = function(id, leagueid, user){
        console.log(id);
        LeagueService.isUserInLeague(id, leagueid).then(function(data){  
            //console.log(data);
            if(data == "1"){
                //add the user to the league because he doesn't exist
                alert("User is already in this league.");
            }else{
                //don't add the user, he's already in the database
                LeagueService.addUserToLeague(id,leagueid,user).then(function(data){
                    alert("User has been successfully added.");
                });
            }
        });
    };
    
    $scope.changeLeagueName = function(){
         var leagueName = PopupService.confirmDialog("Rename League","","Rename").then(function(data){
             console.log(data);
             if(data != "" && data != null){
                 LeagueService.renameLeague("ha6b6pW4tu", $rootScope.leagueViewModel.leagueid,data).then(function(success){
                    if(success){
                        PopupService.messageDialog("League name was successfully changed!");    
                    }else{
                        PopupService.messageDialog("There was an error changing the League's name, please try again later.")
                    }
                 });
             }
         });
    };
    
    $scope.changeLeagueMotto = function(){
        var leagueMotto = PopupService.confirmDialog("Rewrite League Motto","","Save").then(function(data){
             console.log(data);
            if(data != "" && data != null){
                LeagueService.rewriteLeagueMotto("ha6b6pW4tu","ngX2tFbJXt",data).then(function(success){
                if(success){
                    PopupService.messageDialog("League motto was successfully changed!");    
                }else{
                    PopupService.messageDialog("There was an error changing the League's motto, please try again later.")
                }
             }); 
            }
         });
    };
    
    $scope.changeLeagueImage = function(){
        angular.element(document).find('#leagueAvatar')[0].addEventListener('change', function (e){
            console.log("batch");
        }); 
    };
})
      
.controller('addGameCtrl', function($scope) {

})
   
.controller('leagueMemberCtrl', function($scope, $rootScope, LeagueService, $stateParams) { 
                                              
    //retrieves the userleague from the call already made initially                                                                                       
    for(var i = 0; i < $rootScope.leagueViewModel.standings.length; i++){
        //console.log($rootScope.standings[i].id);
        //console.log($stateParams.userid);
        if($stateParams.userleagueid == $rootScope.leagueViewModel.standings[i].id){
            $scope.userleague = $rootScope.leagueViewModel.standings[i];
        }
        if($stateParams.userid == $rootScope.leagueViewModel.users[i].id){
            $scope.user = $rootScope.leagueViewModel.users[i];
        }
    }
    
    //get the recent games of that specific user
    LeagueService.getRecentGamesForUser($stateParams.userleagueid, true).then(function(data){
        $scope.recentUserGames = data;
        $scope.$apply();
    });
    
    $scope.formatAverage = function(str){
        return str;
    }
    
    $scope.getUser = function(id){
        for(var j = 0; j < $rootScope.leagueViewModel.standings.length; j++){
            if(id == $rootScope.leagueViewModel.standings[j].id){
                return $rootScope.leagueViewModel.standings[j];    
            }
        }
    }; 
    
    $scope.printOpponent = function(game){
        if(game.get("userID") == $stateParams.userleagueid){
            return $scope.getUser(game.get("opponentID")).get("ShortName");
        }else{
            return $scope.getUser(game.get("userID")).get("ShortName");
        }
    };
})

.controller('leagueScheduleCtrl', function($scope, LeagueService, $stateParams, $rootScope){
    //gets all of the games 
    LeagueService.getRecentGamesForUser($stateParams.userleagueid, false).then(function(data){
        $scope.scheduledGames = data;
        $scope.$apply();
    });
    
    $scope.getUser = function(id){
        for(var j = 0; j < $rootScope.leagueViewModel.standings.length; j++){
            if(id == $rootScope.leagueViewModel.standings[j].id){
                return $rootScope.leagueViewModel.standings[j];    
            }
        }
    }; 
})

.controller('leagueGameCtrl', function($scope, LeagueService, $stateParams, $rootScope){
    $scope.getUser = function(id){
        for(var j = 0; j < $rootScope.leagueViewModel.standings.length; j++){
            if(id == $rootScope.leagueViewModel.standings[j].id){
                return $rootScope.leagueViewModel.standings[j];    
            }
        }
    }; 
    
    LeagueService.getGame($stateParams.gameid).then(function(data){
        $scope.game = data; 
        $scope.user = $scope.getUser(data.get("userID"));
        $scope.opponent = $scope.getUser(data.get("opponentID"));
        $scope.$apply();
    });
})

.controller('addLeagueCtrl', function($scope, $rootScope, LeagueService, PopupService){
    $scope.createLeague = function(name, type, motto){
        console.table($rootScope.user);
        LeagueService.createLeague(name, type, motto, $rootScope.user.id, $rootScope.user.get("ShortName")).then(function(data){
            if(data){
                PopupService.messageDialog("League Successfully created!");
            }else{
                PopupService.messageDialog("There was an error creating the league.  Please try again later.");
            }
             
        });  
    };
})

.controller('tabCtrl', function($rootScope, LeagueService, $ionicSideMenuDelegate, $scope, $state){  
    
//    if($rootScope.leagueid == null || $rootScope.leagueid == ""){
//        $rootScope.isEmptyLeague = true;
//    }else{
//        $rootScope.isEmptyLeague = false;
//    }
    
    $rootScope.switchLeagues = function(leagueid){
        LeagueService.initLeague(leagueid,"ncJ40LvgkH").then(function(data){
            $rootScope.leagueViewModel = data; 
            $rootScope.toggleMenu();
            $state.go("tabsController.leagueHome");  
            
        });
    };
    
    
    $rootScope.switchLeagues("ngX2tFbJXt");
    
    $rootScope.toggleMenu = function(){
        $ionicSideMenuDelegate.toggleLeft();
    }
})
 