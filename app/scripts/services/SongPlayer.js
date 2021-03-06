(function() {
  function SongPlayer($rootScope, Fixtures, Metrics) {
    var SongPlayer = {};

/**
* @desc set current album from collection
* @type {Object}
*/
    var currentAlbum = Fixtures.getAlbum();
/**
* @desc Buzz object audio file
* @type {Object}
*/
    var currentBuzzObject = null;

/**
* @function setSong
* @desc Stops currently playing song and loads new audio file as currentBuzzObject
* @param {Object} song
*/
    var setSong = function(song) {
      if (currentBuzzObject) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentBuzzObject.bind('timeupdate', function() {
        $rootScope.$apply(function() {
          SongPlayer.currentTime = currentBuzzObject.getTime();
        });
      });

      currentBuzzObject.bind('ended', function(){
        Metrics.registerSongPlay(SongPlayer.currentSong);
      });

      SongPlayer.currentSong = song;
    };

/**
* @function playSong
* @desc plays current song
* @param {Object} song
*/
    var playSong = function(song){
      currentBuzzObject.play();
      song.playing = true;
    };

/**
* @function getSongIndex
* @desc Get index of song
* @param {Object} song
*/
    var getSongIndex = function(song) {
      return currentAlbum.songs.indexOf(song);
    };


/**
* @desc current audio file
* @type {Object}
*/
    SongPlayer.currentSong = null;
/**
* @desc Current playback time (in seconds) of currently playing song
* @type {Number}
*/
    SongPlayer.currentTime = null;

/**
* @function play
* @desc Play current or new song
* @param {Object} song
*/
    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song) {
        setSong(song);
        playSong(song);
      } else if (SongPlayer.currentSong === song) {
        if (currentBuzzObject.isPaused()) {
          currentBuzzObject.play();
        }
      }
    };

    var stopSong = function() {
      currentBuzzObject.stop();
      song.playing = null;
    };

/**
* @function pause
* @desc Pause current song
* @param {Object} song
*/
    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };

/**
* @function previous
* @desc Play previous song
* @param {Object}
*/
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
        currentSongIndex--;

      if (currentSongIndex < 0) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

/**
* @function next
* @desc Play next song
* @param {Object}
*/
    SongPlayer.next = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
        currentSongIndex++;

      if (currentSongIndex > currentAlbum.length) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

/**
* @function setCurrentTime
* @desc Set current time (in seconds) of currently playing song
* @param {Number} time
*/
     SongPlayer.setCurrentTime = function(time) {
       if (currentBuzzObject) {
         currentBuzzObject.setTime(time);
       }
     };

     SongPlayer.volume = null;

/**
* @function setCurrentVolume
* @desc Set current volume of currently playing song
* @param {Number}
*/
     SongPlayer.setCurrentVolume = function(value) {
       if (currentBuzzObject) {
         currentBuzzObject.setVolume(value);
       }
     };

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', ['$rootScope', 'Fixtures', 'Metrics', SongPlayer]);
})();
