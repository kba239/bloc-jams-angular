(function() {
  function AlbumCtrl(Fixtures) {
    this.albumData = getAlbum;
  }

  angular
    .module('blocJams')
    .controller('AlbumCtrl', ['Fixtures', AlbumCtrl);
 })();
