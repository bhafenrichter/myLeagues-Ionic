angular.module('app.services', [])

.factory('AccountService', [function($q, $location){
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

.service('LeagueService', [function(){
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
            success:function(results){console.log(results);},
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
                
                console.log(opponent.get("PointsScored"));
                console.log(opponentScore);
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
            success:function(data){console.table(data);},
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
    
    return factory;
}]);

