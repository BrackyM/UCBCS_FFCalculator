var newTest ='';
var playerData, nflAPI, userLineups, league, userData;
var articleEL = $('#articles');
var spinner = $('#spinner');
var searchBtn = document.querySelector('#search-btn');


fetch("./Assets/Local data/playerdata.json")
.then(response => {
   return response.json();
})
.then(data => {
   playerData = data;
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
   console.log(userData.user_id);
   console.log(playerData);

   var matchingData = league.filter( (league) => {
      if(league.owner_id == userData.user_id){
         return true;
      }})
      console.log(matchingData);

      var matchingPlayers = matchingData[0].players;
      console.log(matchingPlayers);
      
      var newPlayerData = Object.values(playerData)


      console.log(newPlayerData)
      console.log(Object.keys(playerData));
      console.log(Object.values(playerData));
      console.log(Object.entries(playerData));
      
      var newArray = []
      for (var varPlayer of matchingPlayers){
         newArray.push(playerData[varPlayer])
         }
      
      console.log(newArray)
         for (let i=0; i < newArray.length; i++){
         $('#teamcard-players').append("<li>"+ newArray[i].full_name + "</li>")
         }
   });
      // for (userPlayerValue of Object.entries(playerData)){
      //    console.log(playerDataValue);
      //    for (let i=0; i < matchingPlayers.length; i++){
      //       if (playerDataValue == matchingPlayers[i]){
      //       $('#teamcard-players').append("<li>"+ playerDataValue[1].full_name + "</li>")
      //    }
      // }}





      // [player list = [0= {key: 1, value: 500},1,2,3,4,5}]

      // function multiplyAll(arr) {
      //    let product = 1;
      //    // Only change code below this line
      //    for (let i = 0; i < arr.length; i++) {
      //      for (let j = 0; j < arr[i].length; j++) {
      //        console.log(arr[i][j]);
      //      }
      //    }
      //    // Only change code above this line
      //    return product;
      //  }
       
      //  multiplyAll([[1,2],[3,4],[5,6,7]]);
         // 1
         // 2
         // 3
         // 4
         








      // for (let i=0; i < matchingData[0].players.length; i++){
      //    $('#teamcard-players').append("<li>"+ matchingData[0].players[i] + "</li>")
      //   }




   //    for (league.owner_id of league){
//       console.log(league.owner_id);
//       $('#teamcard-players').append("<li>"+ league.players + "</li>")
//       if (league.owner_id === userData.user_id){
//          for (let i=0; i < league.players; i++){
//             $('#teamcard-players').append("<li>"+ league.players[i] + "</li>")
//          }
//    }
// //       if (league[i].owner_id !== userData.user_id){
// //          for (let i=0; i <league[i].players; i++) {
// //             $('#teamcard-players').append("<li>" + league[i].players[i] + "</li>")
// //          }
// //       } else {
// //          return;
// //       }
// // }
// }


};

// Search button event
searchBtn.addEventListener("click", searchClickHandler);

//Creating function to open new page on load