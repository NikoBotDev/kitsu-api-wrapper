const Kitsu = require('../index');

(async () => {
  const anime = await Kitsu.getAnime('Ano Hana', 2);
  console.log(anime);
  const manga = await Kitsu.getManga('Street fighting cat', 1);
  console.log(manga);
})();
