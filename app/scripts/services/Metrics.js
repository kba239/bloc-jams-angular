(function() {
  function Metrics($firebaseArray) {

    var ref = firebase.database().ref();
    var songPlays = $firebaseArray(ref.child("songPlays"));

    return {
      registerSongPlay: function(songObj) {
        songObj.playedAt = moment().format('L');
          songPlays.$add(songObj);
        },

        listSongsPlayed: function() {
          var songs = [];
          angular.forEach(songPlays, function(song) {
            songs.push(song.title);
          });
          return songs;
        }
      };
    }

  angular
    .module('blocJams')
    .service('Metrics', ['$firebaseArray', Metrics]);
})();
