const Kitsu = require('../index');

(async function T() {
  const anime = await Kitsu.getAnime('One Piece');
  console.log(anime);
})();