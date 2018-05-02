const fetch = require('snekfetch');
class KitsuAPI {
  constructor() {
  }
  /**
     * @typedef {Object} Anime
     * @property {string} title
     * @property {string} anime
     * @property {?number} episodes null if isn't finished
     * @property {string} status
     * @property {Array<String>} genres
     * @property {number} score
     * @property {string} image
     * @property {string} synopsis
     */
  /**
 * Search about an anime using the KitsuAPI.
 * @param {string} anime
 * @returns {Promise<?Anime>}
 */
  static async getAnime(anime) {
    const that = new this();
    let data = await fetch.get(`https://kitsu.io/api/edge/manga?filter[text]=${encodeURIComponent(anime)}`).catch(e => {
      console.error(e);
      return null;
    });
    if(!data)
      return null;
    const d = that.parseJSON(data.body.toString());
    let counter = 0;
    const o = {
      title: d.attributes.titles.en_jp,
      episodes: d.attributes.episodeCount,
      status: d.attributes.status,
      genres: await that.getGenres(d.relationships.genres.links.related),
      score: Math.round(d.attributes.averageRating),
      image: d.attributes.posterImage.original,
      synopsis: d.attributes.synopsis.replace(/(?:\r\n|\r|\n)/g, matched => {
        if(/\r\n/.test(matched) && counter % 2 == 0) {
          counter++;
          return '\n';
        }
        counter++;
        return '';
      })
    };
    return o;
  }
  /**
   * @typedef {Object} Manga
     * @property {string} title
     * @property {?number} chapterCount null if is publishing
     * @property {string} status
     * @property {Array<String>} genres
     * @property {number} score Rounded score number
     * @property {string} image
     * @property {string} synopsis
   */
  /**
   * Search about a manga using the KitsuAPI.
   * @param {string} manga manga name
   * @returns {Promise<?Manga>}
   */
  static async getManga(manga) {
    const that = new this();
    let data = await fetch.get(`https://kitsu.io/api/edge/manga?filter[text]=${encodeURIComponent(manga)}`).catch(e => {
      console.error(e);
      return null;
    });
    if(!data)
      return null;
    let counter = 0;
    const d = that.parseJSON(data.body.toString());
    const o = {
      title: d.attributes.titles.en_jp,
      chapterCount: d.attributes.chapterCount,
      status: d.attributes.status,
      genres: await that.getGenres(d.relationships.genres.links.related),
      score: Math.round(d.attributes.averageRating),
      image: d.attributes.posterImage.original,
      synopsis: d.attributes.synopsis.replace(/(?:\r\n|\r|\n)/g, matched => {
        if(/\r\n/.test(matched) && counter % 2 == 0) {
          counter++;
          return '\n';
        }
        counter++;
        return '';
      })
    };
    return o;
  }
  parseJSON(raw) {
    const json = JSON.parse(raw);
    const p = json.data[0];
    return p;
  }
  async getGenres(link) {
    const d = await fetch.get(link);
    const j = JSON.parse(d.body.toString());
    const genres = [];
    for(const g of j.data) {
      if(!g || !g.attributes.name)
        return;
      genres.push(g.attributes.name);
    }
    return genres;
  }
} 
module.exports = KitsuAPI;