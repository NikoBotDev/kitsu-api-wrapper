const Kitsu = require('../index');

(async () => {
  const anime = await Kitsu.getAnime('One Piece');
  console.log(anime);
})();
