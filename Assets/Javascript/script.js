var sleeperAPI, nflAPI, userLineups, league, userData;
var articleEL = $('#articles');
var spinner = $('#spinner');
var searchBtn = document.querySelector('#search-btn');


fetch("./Assets/Local data/playerdata.json")
.then(response => {
   return response.json();
})
.then(data => {
   sleeperAPI = data;
   console.log(data)
   return fetch("http://site.api.espn.com/apis/site/v2/sports/football/nfl/news");
})
.then(response => {
   return response.json();
})
.then (data => {
   nflAPI = data;
   console.log(data);
   
   for (let i = 0; i < nflAPI.articles.length; i++) {
      var headlineLink = nflAPI.articles[i].links.web.href
      $(spinner).append(" <i class='fa-solid fa-newspaper fa-xl'></i> " + "<a class='tag is-success'href=" + headlineLink + ">" + nflAPI.articles[i].headline + "</a>" );
   }
   Marquee3k.init()
});

function searchClickHandler (event) {
   event.preventDefault();
   var username = document.querySelector('#username').value;
   if (!event.target.matches('#search-btn')) {
      return;
   } else {
   userSearch(username);
   console.log(username);
   
   }
};

// Username Search Function for Fantasy Team
var userSearch = function (username) {
var apiURL = "https://api.sleeper.app/v1/user/"+ username;
fetch(apiURL)
.then(response => {
   return response.json();
})
.then(data => {
   userData = data;
   console.log(data)
   $('#welcome-user').append("<img src='https://sleepercdn.com/avatars/" + userData.avatar + "' id=user-image >");
   $('#welcome-user').append("<h2 class='title is-2 m-5'> Welcome " + username + "</h2>");
   $('#welcome-user').append("<button class='button is-success' id='leaguedata'> Leauge Data </button>");
   return fetch("https://api.sleeper.app/v1/user/" + userData.user_id + "/leagues/nfl/2022");
})
.then(response => {
   return response.json();
})
.then(data => {
   userLineups = data;
   console.log(userLineups);
   var lineup1 = userLineups[0].league_id;
   console.log(lineup1);
   $('#team1').append("<h2>" + userLineups[0].name + "</h2>"); 
      
      for (let i=0; i < userLineups[0].roster_positions.length; i++){
         $('#teamcard-positions').append("<li>" + userLineups[0].roster_positions[i] + "</li>");
      };

   return fetch("https://api.sleeper.app/v1/league/" + lineup1 + "/rosters");
})
.then(response => {
   return response.json();
})
.then(data => {
   league = data;
   console.log(data);
   const currentUser = league.filter(getUserID)

   function getUserID(value, index, array){
      return value === userData.user_id;
   }

   console.log(getUserID);

//    for (let i=0; i < league.length; i++){
//       if (league[i].owner_id !== userData.user_id){
//          for (let i=0; i <league[i].players; i++) {
//             $('#teamcard-players').append("<li>" + league[i].players[i] + "</li>")
//          }
//       } else {
//          return;
//       }
// }
});


};

// Search button event
searchBtn.addEventListener("click", searchClickHandler);

