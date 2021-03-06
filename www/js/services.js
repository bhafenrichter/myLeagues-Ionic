angular.module('app.services', [])

.service('AccountService', [function($q, $location){
    var factory = {};
    factory.login = function(username, password){
        return Parse.User.logIn(username, password,{
            success: function(user){
                return "true";
            },
            error: function(user, error){
                alert("Invalid Login, please try again.");
                console.log(error);
            }
        });
    };
    
    factory.createAccount = function(username,password, email){
        var user = new Parse.User();
        console.log(password);
        user.set("username", username);
        user.set("password", password);
        user.set("email",email);
        
        return user.signUp(null, {
            success: function(user){
                return "true";
            },
            error: function(user, error){
                alert("Error creating user.  Please try again with different credentials.");
                console.log(error);
            }
        });
    }
    
    return factory;
}])

.service('LeagueService', ['$q', function($q){
    var factory = {};
    
    factory.getRecentGames = function(leagueid){
        var recentGames = Parse.Object.extend("Game");
        var query = new Parse.Query(recentGames);
        query.equalTo("LeagueID",leagueid);
        query.descending("createdAt");
        query.limit(10);
        return query.find({
            success:function(results){
                //console.log(results);
            },
            error: function(error){
                console.log(error);   
            }
        });
    };
    
    factory.getLeagueStandings = function(leagueid){
        var standings = Parse.Object.extend("UserLeague");
        var query = new Parse.Query(standings);
        query.equalTo("LeagueID",leagueid);
        query.include(Parse.User);
        query.descending("Wins");
        return query.find({
            success:function(results){},
            error:function(error){console.log(error);}
        });
    };
    
    factory.getUserInformation = function(userid){ 
        var query = new Parse.Query(Parse.User);
        query.equalTo("objectId", userid);
        return query.first({
            success:function(user){},
            error:function(error){console.log(error);}
        });
    };
    
    factory.getUserLeagueInformation = function(userleagueid){
        var query = new Parse.Query("UserLeague");
        query.equalTo("objectId", userleagueid);
        return query.first({
            success:function(user){},
            error:function(error){console.log(error);}
        });    
    };
    
    factory.getAllUserInformation = function(userleaguearray){
        //console.table(userleaguearray);
        var query = new Parse.Query(Parse.User);
        query.containedIn("objectId", userleaguearray);
        return query.find({
            success:function(results){},
            error:function(error){console.log(error);}
        });
    };
    
    factory.getRecentGamesForUser = function(userleagueid, isLimited){
        
        var gamesAsUser = new Parse.Object.extend("Game");
        var query1 = new Parse.Query(gamesAsUser);
        query1.equalTo("userID", userleagueid);
        
        var gamesAsOpponent = new Parse.Object.extend("Game");
        var query2 = new Parse.Query(gamesAsOpponent);
        query2.equalTo("opponentID", userleagueid);
        
        var mainQuery = Parse.Query.or(query1, query2);
        mainQuery.descending("createdAt");    
        
        if(isLimited){
            mainQuery.limit(3);
        }
        return mainQuery.find({
            success:function(results){},
            error:function(error){console.log(error);}
        });
    };
    
    factory.getGame = function(id){
        var game = new Parse.Object.extend("Game");
        var query = new Parse.Query(game);
        
        query.equalTo("objectId", id);
        return query.first({
            success:function(results){},
            error: function(error){console.log(error);}
        });
    }
    
    factory.searchUsers = function(searchText){
        var query = new Parse.Query(Parse.User);
        query.contains("username", searchText);
        return query.find({
            success:function(results){console.table(results);},
            error:function(error){console.log(error);}
        }); 
    };
    
    factory.searchUserLeagues = function(searchText, leagueid){
        var query = new Parse.Query("UserLeague");
        query.contains("ShortName", searchText);
        query.equalTo("LeagueID", leagueid);
        return query.find({
            success:function(results){console.table(results);},
            error:function(error){console.log(error);}
        }); 
    };
    
    //adds user to specified league
    factory.addUserToLeague = function(userid, leagueid, user){

        //add user to league
        var UserLeague = Parse.Object.extend("UserLeague");
        var userleague = new UserLeague();
        userleague.set("PointsAllowed", "0");
        userleague.set("PointsScored", "0");
        userleague.set("UserID", userid);
        userleague.set("ShortName", user.get("firstName").substring(0,1) + ". " + user.get("lastName"));
        userleague.set("LeagueID", leagueid);
        userleague.set("isDeleted", false);
        userleague.set("Wins", "0");
        userleague.set("Losses", "0");
        userleague.set("ProfilePictureUrl", user.get("profilePictureUrl"));
        
        return userleague.save(null, {
            success:function(userleague){alert("User has been added!");},
            error:function(error){alert(error);}
        });
                       
    };

    factory.isUserInLeague = function(userid, leagueid){
        //check to see if user is currently in the league
        var query = new Parse.Query("UserLeague");
        query.equalTo("UserID", userid);
        query.equalTo("LeagueID", leagueid);
        console.log(userid);
        console.log(leagueid);
        return query.count({
            success: function(count){
                if(count > 0){
                    return true; 
                }else{
                    return false;   
                }
            },
            error: function(error){console.log(error);}
        });  
    };
    
    factory.getLeagueInformation = function(leagueid){
        var query = new Parse.Query("League");
        query.equalTo("objectId", leagueid);
        return query.first({
            success:function(data){return data;},
            error: function(error){console.log(error);}
        });
    }
    
    factory.generateEmptyUser = function(){
        var UserLeague = Parse.Object.extend("UserLeague");
        var userleague = new UserLeague();
        userleague.set("ShortName","(Select User)");
        userleague.set("Wins","0");
        userleague.set("Losses","0");
        userleague.set("ProfilePictureUrl","http://divine-warfare.com/static/img/empty_user.png");
        return userleague;
    }
    
    factory.addGame = function(user, opponent, userscore, opponentScore, headlinetext, leagueid, location, headlineImage){
        var Game = Parse.Object.extend("Game");
        var game = new Game();
        game.set("userID", user.id);
        game.set("opponentID", opponent.id);
        game.set("userScore", userscore);
        game.set("LeagueID", leagueid);
        game.set("opponentScore", opponentScore);
        game.set("headlineText", headlinetext);
        game.set("location", location);
        game.set("headlineImage", headlineImage);
        game.set("opponentComments", "");
        
        return game.save(null, {
            success:function(game){
                //update the players
                if(+userscore > +opponentScore){
                    
                    user.increment("Wins");
                    opponent.increment("Losses");
                }
                else{
                    user.increment("Losses");
                    opponent.increment("Wins");
                }

                user.increment("PointsScored", user.get("PointsScored") + Number(userscore));
                user.increment("PointsAllowed", user.get("PointsAllowed") + Number(opponentScore));
                opponent.increment("PointsScored", opponent.get("PointsScored") + Number(opponentScore));
                opponent.set("PointsAllowed", opponent.get("PointsAllowed") + Number(userscore));
                
                user.save();
                opponent.save();
            },
            error:function(error){alert("There was an error submitting this game.  Please try again later.");}
        });
        
    };
    
    factory.getLeaguePosts = function(leagueid){
        var query = new Parse.Query("LeaguePost");
        query.equalTo("leagueId", leagueid);
        return query.find({
            success:function(data){},
            error:function(error){console.log(error);}
        });
        
    };
    
    factory.postToWall = function(authorid, leagueid, title, contents){
        var Post = Parse.Object.extend("LeaguePost");
        var post = new Post();
        post.set("leagueId", leagueid);
        post.set("userID", authorid);
        //post.set("headlineText", title);
        post.set("headlineText", contents);
        
        return post.save(null, {
                        success:function(post){alert("Message Posted!");},
                        error:function(error){console.log(error);}
        });
    };
    
    factory.renameLeague = function(userid, leagueid, name){
        //get the league and modify its name
        var query = new Parse.Query("League");
        query.equalTo("objectId", leagueid);
        return query.first({
            success:function(league){
                league.set("LeagueName", name);
                league.save(null,{
                    success:function(){
                        factory.postToWall(userid,leagueid,"League Admin", "The league has been renamed to '" + name + ".'");
                        return true;
                    },
                    error:function(){
                        alert("Error Changing Name");
                    }
                });
                return true;
            },    
            error:function(error){ return false; }
        });
    };
    
    factory.rewriteLeagueMotto = function(userid, leagueid, motto){
        var query = new Parse.Query("League");
        query.equalTo("objectId", leagueid);
        return query.first({
            success:function(league){
                league.set("LeagueMotto", motto);
                league.save();
                return true;
            },    
            error:function(error){ return false; }
        });
    };
    
    factory.getLeaguesForUser = function(userid){
        //get the user leagues for the leagueids the user is in
        return factory.getUserLeagues(userid).then(function(data){
            //generate array to hold leagueids we're querying for
            var leagueids = [];
            for(var i = 0; i < data.length; i++){
                leagueids.push(data[i].get("LeagueID"));
            }
            //console.table(leagueids);
            
            //get all of the leagues that contain these ids
            var query = new Parse.Query("League");
            query.containedIn("objectId", leagueids);
            return query.find({
                success:function(data){return data;},
                error:function(error){console.log(error);}
            })
        });
        
    };
    
    factory.getUserLeagues = function(userid){
        var query = new Parse.Query("UserLeague");
        query.equalTo("UserID", userid);
        query.equalTo("isDeleted",false);
        return query.find({
            success:function(data){return data;},
            error:function(error){console.log(error);}
        })
    };
    
    factory.createLeague = function(name, type, motto, userid, shortName){
        var League = Parse.Object.extend("League");
        var league = new League();
        league.set("LeagueName", name);
        league.set("LeagueType", type);
        league.set("LeagueMotto", motto);
        league.set("GameCount", 0);
        league.set("IsDeleted", false);
        
        return league.save(null, {
            success:function(league){
                //add user to league
                var UserLeague = Parse.Object.extend("UserLeague");
                var userleague = new UserLeague();
                userleague.set("UserID", userid);
                userleague.set("LeagueID", league.id);
                userleague.set("Wins", 0);
                userleague.set("Losses", 0);
                userleague.set("PointsAllowed", 0);
                userleague.set("PointsScored", 0);
                userleague.set("isDeleted", false);
                userleague.set("ShortName", shortName);
                userleague.save(null,{
                    success:function(userleague){return true;},
                    error:function(error){return false;}
                });
                return true;
            
            },
            error:function(error){return false;}
        });
    };
    
    factory.initLeague = function(leagueid,userid, userleagueid){
        var leagueViewModel = {};
        leagueViewModel.userid = userid;
        leagueViewModel.leagueid = leagueid;
        leagueViewModel.userleagueid = userleagueid;
        leagueViewModel.switchLeague = function(league){
            console.log(league.objectId);
            leagueViewModel.leagueid = league.objectId;
        }

        var task1 = factory.getLeaguesForUser(leagueViewModel.userid).then(function(data){
            leagueViewModel.myLeagues = data; 
        });

        //gets league information
        var task2 = factory.getLeagueInformation(leagueViewModel.leagueid).then(function(data){
            leagueViewModel.league = data;
        });



        //gets the league standings
        var task3 = factory.getLeagueStandings(leagueViewModel.leagueid).then(function(data){
            leagueViewModel.standings = data;
            //console.table(data[0].toJSON());
        }).then(function(){
            //retrieves the deeper user information with the userleague ids
            var ids = new Array(leagueViewModel.standings.length);
            for(var i = 0; i < leagueViewModel.standings.length; i++){
                ids[i] = leagueViewModel.standings[i].get("UserID");
            }
            //makes the call to the database
            factory.getAllUserInformation(ids).then(function(data){
                leagueViewModel.users = data;
            });
        });

        //gets the most recent games in the league
        var task4 = factory.getRecentGames(leagueViewModel.leagueid).then(function(data){
            leagueViewModel.recentGames = data;
            //get the posts
            factory.getLeaguePosts(leagueViewModel.leagueid).then(function(data2){
                leagueViewModel.posts = data2;
                console.log(data2);
                //merge the posts and the games for leaguehome news feed
                //var feed = leagueViewModel.recentGames.concat(leagueViewModel.posts);
                var feed = data2;
                feed.sort(function(a,b){return b.get("createdAt") - a.get("createdAt");})
                //console.table(feed);

                //remove elements that don't have headline texts to them
//                for(var i = 0; i < 10; i++){
//
//                    if((typeof feed[i].get("headlineText") == 'undefined')){
//                        feed.splice(i,2);
//                        //console.log(i);
//                    }
//                }

                leagueViewModel.feed = feed;
                console.log(leagueViewModel.feed);
            });
        });

        var task5 = factory.getUserLeagueInformation(leagueViewModel.userleagueid).then(function(data){
            leagueViewModel.user = data;
            //console.log(data);
        });
        
        //wait for all tasks to resolve then send back the data
        return $q.all([task1, task2, task3, task4, task5]).then(function(){        
            console.log(leagueViewModel);
            return leagueViewModel;
        });

    }
    
    factory.leaveLeague = function(userleagueid){
        var query = new Parse.Query("UserLeague");
        query.equalTo("objectId", userleagueid);
        return query.first({
            success:function(results){
                console.log(userleagueid);
                results.set("isDeleted", true);
                results.save();
            },
            error: function(error){console.log(error);}
        });
    };
    
    return factory;
}])

.service('PopupService', ['$ionicPopup', function($ionicPopup){
    var factory = {};
    
    factory.confirmDialog = function(title, contents, actionName){
        var data = {};
        
        return $ionicPopup.prompt({
           title: title,
           inputType: 'input',
           inputPlaceholder: contents
         });
    }
    
    factory.messageDialog = function(message){
        var alertPopup = $ionicPopup.alert({
         title: 'Message',
         template: message
       });
    };
    
    return factory;
}]);


