// Global Variables for API calls
var playerData,
  nflNews,
  allUserLeagues,
  firstTwoLeagues,
  league1,
  league2,
  usernameData,
  nflLiveScore,
  userRosterID1,
  userRosterID2,
  twoLeagueDatabase,
  matchupID;

// Variables for header styling and button click
var articleEL = $("#articles");
var spinner = $("#spinner");
var searchBtn = document.querySelector("#search-btn");
var nflScores = "http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";

// Variables for news/score updates
var scoreText = $("#nflScoreText");
var scoreImage = $("#scoreImage");
var weeklyMatchups = $("#weeklyMatchups");

// Fetching data from our local data, massive file of all NFL athletes and their names/stats
fetch("./Assets/Local data/playerdata.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    // Logging NFL player data in a variable
    playerData = data;
    console.log(data);
    // Fetching NFL news from ESPN's "secret" API
    return fetch(
      "https://site.api.espn.com/apis/site/v2/sports/football/nfl/news"
    );
  })
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    // Storing NFL News data in a variable
    nflNews = data;
    console.log(data);

    // Looping through the NFL News data, appending it to our spinner element. Adding hrefs for
    for (let i = 0; i < nflNews.articles.length; i++) {
      var headlineLink = nflNews.articles[i].links.web.href;
      $(spinner).append(
        " <i class='fa-solid fa-newspaper fa-xl'></i> " +
          "<a class='tag is-success'href=" +
          headlineLink +
          " target='_blank'>" +
          nflNews.articles[i].headline +
          "</a>"
      );
    }

    // Calling Marquee3k, a script that will create a spinning banner inside any div we call it to
    Marquee3k.init();
    return fetch(nflScores);
  })
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    // Saving NFL Score API data to global variable
    nflLiveScore = data;
    console.log(nflLiveScore);

    // Setting Score/Upcoming Events title with current week and current year
    $(scoreText).text(
      "Games and News for NFL Week " +
        nflLiveScore.week.number +
        " of " +
        nflLiveScore.season.year
    );

    // Looping through NFL events for this week, putting game date through Date function, then putting that date into a date-string to remove hours/timezone
    for (let i = 0; i < nflLiveScore.events.length; i++) { 
      
      
      var gameDate = nflLiveScore.events[i].date;
      var date = new Date(gameDate);
      var newDate = date.toDateString();
      var gameVenue = nflLiveScore.events[i].competitions[0].venue.address.city;
      var attendance = nflLiveScore.events[i].competitions[0].attendance
      var passingLeaderPlayer = nflLiveScore.events[i].competitions[0].leaders[0].leaders[0].athlete.fullName
      var opponentLeaderPlayer = nflLiveScore.events[i].competitions[0].leaders[1].leaders[0].athlete.fullName
      
      
      //Not in use...
      // var passingLeaderImage = nflLiveScore.events[i].competitions[0].leaders[0].leaders[0].athlete.headshot
      //var gameOdds = nflLiveScore.events[i].competitions[0].odds[0].details

      // Appending NFL events for this week and creating links/buttons for them
      $(weeklyMatchups).append(
         "<article class='message is-dark'><div class='message-header p-0'><h4 class='title is-3 has-text-success p-4'><a href=" + 
         nflLiveScore.events[i].links[0].href +
         " target='_blank' > " +
         nflLiveScore.events[i].name + 
         "</a> " + newDate + " </h4></div><div class='message-body text-align-center'><p> @ " + gameVenue + "  || Attendance Count: " + attendance +  "  || Overall passing leader for this match: " 
         +  passingLeaderPlayer + " ||  Overall recieving leader for this match: " + opponentLeaderPlayer +"</p></div></article>"
      )
      
    }
  });

// Function on click to fetch Sleeper APIS //
//                                        //
//                                       //
function searchClickHandler(event) {
  event.preventDefault();
  // Getting username from input field through querySelector
  var username = document.querySelector("#username").value;
  if (!event.target.matches("#search-btn")) {
    return;
  } else {
    // Running our userSearch function and passing the username
    userSearch(username);
    console.log(username);
  }
}

// Username Search Function for Fantasy Team API
var userSearch = function (username) {
  // Concatenating our API url with the username value passed from our search button function
  var apiURL = "https://api.sleeper.app/v1/user/" + username;
  fetch(apiURL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // Saving data recieved from username search through Sleeper API
      usernameData = data;
      console.log(data);
      //Appending our welcome box with user avatar, a welcome with their username and then fetching a new API call with their userdata
      $("#welcome-user").empty();
      $("#welcome-user").append(
        "<img src='https://sleepercdn.com/avatars/" +
          usernameData.avatar +
          "' id=user-image >"
      );
      $("#welcome-user").append(
        "<h2 class='title is-2 m-5'> Welcome " + username + "</h2>"
      );
      $("#welcome-user").append(
        "<button class='button is-success' id='leaguedata'> Leauge Data </button>"
      );

      // We can only fetch a user's leagues data by traversing at least one API call, i.e. from /user/username to /user/user_id/leagues
      // Sleeper requires us to fetch a user_id instead of username to get their league information.
      // From here we are only interested in user_id and no longer need username (we also will not get usernames for other players through our calls)
      return fetch(
        "https://api.sleeper.app/v1/user/" +
          usernameData.user_id +
          "/leagues/nfl/2022"
      );
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // Getting all available Fantasy Football leagues for a user, through their id, then only using the first two league data for our purposes
      allUserLeagues = data;
      console.log(allUserLeagues);
      // Setting our global variables of league 1 and league 2 to match the first two ID's given back from all-user-leagues.
      // We cannot search other player / opponent data without this league id, as each league has unique players and settings/id's for those players
      league1 = allUserLeagues[0].league_id;
      league2 = allUserLeagues[1].league_id;
      console.log(league1);
      console.log(league2);

      //Emptying previously appended content (if new search)
      $("#team1card-content").empty();
      $("#league2card-content").empty();
      // Appending the two league names to our card boxes (i.e. Braxton n Friends, Fantasy Foot Boys) whatever it may be
      $("#team1card-content").append(
        "<h2 class=title is-4 has-text-centered>" +
          allUserLeagues[0].name +
          "</h2>"
      );
      $("#league2card-content").append(
        "<h2 class=title is-4 has-text-centered>" +
          allUserLeagues[1].name +
          "</h2>"
      );

      // Filtering through the user's first two leagues and selecting their roster positions (i.e. QB, RB, WR and so on) and not including "BN" (Benched players or players on bench)
      var rosterPositions1 = allUserLeagues[0].roster_positions.filter(
        function (item) {
          return item !== "BN";
        }
      );
      var rosterPositions2 = allUserLeagues[1].roster_positions.filter(
        function (item) {
          return item !== "BN";
        }
      );

      //Emtpying card positions
      $("#teamcard-positions").empty();
      $("#teamcard-positions2").empty();

      // Appending the roster positions for each of our two leagues to our card boxes (i.e. QB, RB, WR and so on)
      for (let i = 0; i < rosterPositions1.length; i++) {
        $("#teamcard-positions").append(
          "<ul><li class='is-size-5'>" +
            allUserLeagues[0].roster_positions[i] +
            "</li></ul>"
        );
      }
      for (let i = 0; i < rosterPositions2.length; i++) {
        $("#teamcard-positions2").append(
          "<ul><li class='is-size-5'>" +
            allUserLeagues[1].roster_positions[i] +
            "</li></ul>"
        );
      }

      // Using promise.all to fetch the two leagues' roster data. Roster data !== league data as roster data returns
      return Promise.all([
        fetch("https://api.sleeper.app/v1/league/" + league1 + "/rosters"),
        fetch("https://api.sleeper.app/v1/league/" + league2 + "/rosters"),
      ]);
    })
    .then((response) => {
      return Promise.all(
        response.map(function (response) {
          return response.json();
        })
      );
    })
    .then((data) => {
      // Gathering roster data for both leagues in one dataset, the problem to solve now is filtering through these two object arrays and finding where our user is located
      firstTwoLeagues = data;
      console.log(data);
      console.log(usernameData.user_id);

      // For this specific API call owner_id === user_id (not sure why they chose to change the name of this key)
      // Finding the user within the first league roster by filtering out any owner_id's that !== our user's user_id.
      var userRosterInfo1 = firstTwoLeagues[0].filter((firstTwoLeagues) => {
        if (firstTwoLeagues.owner_id == usernameData.user_id) {
          return true;
        }
      });
      console.log(userRosterInfo1);
      // Finding the user within their second league roster using the same method as above
      var userRosterInfo2 = firstTwoLeagues[1].filter((firstTwoLeagues) => {
        if (firstTwoLeagues.owner_id == usernameData.user_id) {
          return true;
        }
      });
      console.log(userRosterInfo2);

      //Setting our global variables for user roster id's (we'll need this later)
      userRosterID1 = userRosterInfo1[0].roster_id;
      userRosterID2 = userRosterInfo2[0].roster_id;

      console.log(userRosterID1);
      console.log(userRosterID2);

      // Creating a variable for the array of starting players for the first league
      // This will only return us the player ID's which we need to cross reference with our locally stored player database (playerdata.json).
      var startingPlayers1 = userRosterInfo1[0].starters;
      console.log(startingPlayers1);

      // Creating a variable for the array of starting players for the second league
      var startingPlayers2 = userRosterInfo2[0].starters;
      console.log(startingPlayers2);

      // Creating an empty array to collect/match the player id's from our user's roster with our player database
      // Using a for of loop to iterate over our user's roster and matching that with our player database.
      var playersLeague1 = [];
      for (var varPlayer of startingPlayers1) {
        playersLeague1.push(playerData[varPlayer]);
      }
      // Same method for the second league/second roster
      var playersLeague2 = [];
      for (var varPlayer of startingPlayers2) {
        playersLeague2.push(playerData[varPlayer]);
      }
      // Logging the names of our players and the new arrays with their information
      console.log(playersLeague1);
      console.log(playersLeague2);

      // Emptying players appended info/names (if new user search)
      $("#teamcard-players").empty();
      $("#team2card-players").empty();

      // Looping over our new array of players that matches the user's and appending their names to our cards (for league one)
      for (let i = 0; i < playersLeague1.length; i++) {
        if (playersLeague1[i].full_name) {
          $("#teamcard-players").append(
            "<ul class='has-text-left'><li class='is-size-5'>" +
              playersLeague1[i].full_name +
              "</ul></li>"
          );
        } else {
          // Else statement checks for the Defense positions of a Fantasy team. (defense first and last name are logged differently)
          $("#teamcard-players").append(
            "<ul class='has-text-left'><li class='is-size-5'>" +
              playersLeague1[i].last_name +
              "</ul></li>"
          );
        }
      }
      // Looping over our second array of players that matches the user's and appending their names to our cards (for league two)
      for (let i = 0; i < playersLeague2.length; i++) {
        if (playersLeague2[i].full_name) {
          $("#team2card-players").append(
            "<ul class='has-text-left'><li class='is-size-5'>" +
              playersLeague2[i].full_name +
              "</ul></li>"
          );
        } else {
          // Else statement checks for the Defense positions of a Fantasy team. (defense first and last name are logged differently)
          $("#team2card-players").append(
            "<ul class='has-text-left'><li class='is-size-5'>" +
              playersLeague2[i].last_name +
              "</ul></li>"
          );
        }
      }

      // Fetching matchups through league id API Calls (we have to use league ids to find the matchup ids / player points)
      // Cannot use user_id or owner_id here, we are forced to use the league id's we called a while ago
      // Using promise all here to get both matchup's data, this will return us basically the same information as our "Roster" API call but with points for each user
      // This matchup call will also tell us who is "matched up" against each other and how their points compare
      return Promise.all([
        fetch("https://api.sleeper.app/v1/league/" + league1 + "/matchups/1"), //For presentation purposes we are sticking with week one, however if we wanted a weekly update we can
        fetch("https://api.sleeper.app/v1/league/" + league2 + "/matchups/1"), //refer back to nflLiveScore.week.number from the NFL Score API to get the current seasons week!
      ]);
    })
    .then((response) => {
      return Promise.all(
        response.map(function (response) {
          return response.json();
        })
      );
    })
    .then((data) => {
      // Storing the data from our two matchup calls into one variable so we can navigate through a singular object array for both leagues
      twoLeagueDatabase = data;
      console.log(twoLeagueDatabase);

      // Finding the user's roster position from the league matchup data to isolate them in league 1
      var findRosterID1 = twoLeagueDatabase[0].filter((twoLeagueDatabase) => {
        if (twoLeagueDatabase.roster_id == userRosterID1) {
          return true;
        }
      });
      // finding the user's roster position from the league matchup data to isolate them in league 2
      var findRosterID2 = twoLeagueDatabase[1].filter((twoLeagueDatabase) => {
        if (twoLeagueDatabase.roster_id == userRosterID2) {
          return true;
        }
      });
      // Returning user location in the matchup API after filtering for roster-id
      // Doing this to get matchup_id which we cannot get otherwise
      console.log(findRosterID1);
      console.log(findRosterID2);

      // Emptying player points (if new user search)
      $("#teamcard-players1points").empty();
      $("#team2card-players1points").empty();

      // Collecting our points (for the user) per each starting player and appending them to the points column in the first league
      for (let i = 0; i < findRosterID1[0].starters_points.length; i++) {
        $("#teamcard-players1points").append(
          "<ul class='has-text-right has-text-info'><li class='is-size-5'>" +
            findRosterID1[0].starters_points[i] +
            "</ul></li>"
        );
      }
      // Collecting our points (for the user) per each starting player and appending them to the points column in the second league
      for (let i = 0; i < findRosterID2[0].starters_points.length; i++) {
        $("#team2card-players1points").append(
          "<ul class='has-text-right has-text-info'><li class='is-size-5'>" +
            findRosterID2[0].starters_points[i] +
            "</ul></li>"
        );
      }

      // Matchup id's will differ from roster id, but a user's roster id will always remain the same
      // So here we have to use the single array returned from our roster-id search to find the user's match-up id

      var matchupID1 = findRosterID1[0].matchup_id; // always searched user because [0] refers only to one array we pull
      console.log(matchupID1); // gathering matchup_id within our league arrays
      var matchupID2 = findRosterID2[0].matchup_id; // always searched user because [0] refers only to one array we pull
      console.log(matchupID2); // gathering matchup_id within our league arrays

      // Filtering for matchup_ids
      // Pulling just the user and their matchup opponent by comparing the matchup_id
      // This will give our user's information (which we already found) but more importantly our opponents information which we could
      // not have found without matching the matchup_id's !!
      var compareMatchingID1 = twoLeagueDatabase[0].filter(
        (twoLeagueDatabase) => {
          if (twoLeagueDatabase.matchup_id == matchupID1) {
            return true;
          }
        }
      );
      console.log(compareMatchingID1);

      // Finding the other matchup in league 2
      var compareMatchingID2 = twoLeagueDatabase[1].filter(
        (twoLeagueDatabase) => {
          if (twoLeagueDatabase.matchup_id == matchupID2) {
            return true;
          }
        }
      );
      console.log(compareMatchingID2);

      // Filtering through the array of our user and their opponent to just get the opponents data (by matchup_id) for our first league
      var opponentRoster1 = compareMatchingID1.filter((compareMatchingID1) => {
        // looping through to make sure that we don't return the user and only return their opponent
        if (compareMatchingID1.roster_id !== userRosterID1) {
          return true;
        }
      });
      console.log(opponentRoster1);

      // Filtering through the array of our user and their opponent to just get the opponents data (by matchup_id) for our second league
      var opponentRoster2 = compareMatchingID2.filter((compareMatchingID2) => {
        // looping through to make sure that we don't return the user and we return their opponent
        if (compareMatchingID2.roster_id !== userRosterID2) {
          return true;
        }
      });
      console.log(opponentRoster2);

      //Emptying league one opponent points (if new user search)
      $("#teamcard-players2points").empty();
      $("#team2card-players2points").empty();

      // Looping through the points for our opponents' starting players in the second league
      for (let i = 0; i < opponentRoster1[0].starters_points.length; i++) {
        // populating their points within the points column on the index file
        $("#teamcard-players2points").append(
          "<ul class='has-text-left has-text-info'><li class='is-size-5'>" +
            opponentRoster1[0].starters_points[i] +
            "</ul></li>"
        );
      }
      // Looping through the points for our opponents' starting players in the second league
      for (let i = 0; i < opponentRoster2[0].starters_points.length; i++) {
        // populating their points within the points column on the index file
        $("#team2card-players2points").append(
          "<ul class='has-text-left has-text-info'><li class='is-size-5'>" +
            opponentRoster2[0].starters_points[i] +
            "</ul></li>"
        );
      }
      // Creating new variable for the starters of the opponent in league 1
      var opponentStarters1 = opponentRoster1[0].starters;
      console.log(opponentStarters1);

      // Creating new variable for the starters of the opponent in league 2
      var opponentStarters2 = opponentRoster2[0].starters;
      console.log(opponentStarters2);

      // Creating a new array for our opponents player id's so we can match them with our player database like we did for the user
      // For league 1 matchup
      var opponentStartersArray1 = [];
      for (var varPlayer of opponentStarters1) {
        opponentStartersArray1.push(playerData[varPlayer]);
      }
      console.log(opponentStartersArray1);

      //Emptying opponent players (on new user search)
      $("#teamcard-players2").empty();

      // Taking the opponents starter id's and replacing them with the corresponding player name in a loop
      for (let i = 0; i < opponentStartersArray1.length; i++) {
        if (opponentStartersArray1[i].full_name) {
          $("#teamcard-players2").append(
            "<ul class='has-text-right'><li class='is-size-5'>" +
              opponentStartersArray1[i].full_name +
              "</ul></li>"
          );
        } else {
          // Else statement checks for the Defense positions of a Fantasy team. (defense first and last name are logged differently)
          $("#teamcard-players2").append(
            "<ul class='has-text-right'><li class='is-size-5'>" +
              opponentStartersArray1[i].last_name +
              "</ul></li>"
          );
        }
      }

      // Emptying total points for league 2 (if new user search)
      $("#team1points").empty();
      $("#team2points").empty();

      // Populating the total amount of points for each roster in the first league matchup
      $("#team1points").text(findRosterID1[0].points);
      $("#team2points").text(opponentRoster1[0].points);

      // Creating a new array for our opponents player id's so we can match them with our player database like we did for the user
      // For league 2 matchup
      var opponentStartersArray2 = [];
      for (var varPlayer of opponentStarters2) {
        opponentStartersArray2.push(playerData[varPlayer]);
      }
      console.log(opponentStartersArray2);

      //Emptying League 2 Opponent Players Points (on new user search)
      $("#team2card-players2").empty();

      // Taking the opponents starter id's and replacing them with the corresponding player name in a loop
      for (let i = 0; i < opponentStartersArray2.length; i++) {
        if (opponentStartersArray2[i].full_name) {
          $("#team2card-players2").append(
            "<ul class='has-text-right'><li class='is-size-5'>" +
              opponentStartersArray2[i].full_name +
              "</ul></li>"
          );
        } else {
          // Else statement checks for the Defense positions of a Fantasy team. (defense first and last name are logged differently)
          $("#team2card-players2").append(
            "<ul class='has-text-right'><li class='is-size-5'>" +
              opponentStartersArray2[i].last_name +
              "</ul></li>"
          );
        }
      }

      // Emptying total points for league 2 (if new user search)
      $("#team21points").empty();
      $("#team22points").empty();

      // Populating the total amount of points for each roster in the second league
      $("#team21points").text(findRosterID2[0].points);
      $("#team22points").text(opponentRoster2[0].points);
    });
};

// Search button event to start our FFA function
searchBtn.addEventListener("click", searchClickHandler);

//Creating function to open new page on load
