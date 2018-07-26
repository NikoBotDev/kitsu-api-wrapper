const request = require('superagent');
/* eslint-disable require-jsdoc */
class KitsuAPI {
  constructor() {
  }
  /* eslint-enable require-jsdoc */
  /**
     * @typedef {Object} Anime
     * @property {string} title
     * @property {?number} episodeCount null if isn't finished
     * @property {string} status
     * @property {Array<String>} genres
     * @property {number} score
     * @property {string} image
     * @property {string} synopsis
     */
  /**
 * Search about an anime using the KitsuAPI.
 * @param {string} anime
 * @return {Promise<?Anime>}
 */
  static async getAnime(anime) {
    const that = new this();
    const req = await request.get(`https://kitsu.io/api/edge/manga?filter[text]=${encodeURI(anime)}`);
    if (!req) {
      return null;
    }
    const d = req.body.data[0];
    const episodeCount = d.attributes.episodeCount;
    let counter = 0;
    let score = Math.round(d.attributes.averageRating);
    const o = {
      title: d.attributes.titles.en_jp,
      episodeCount: episodeCount ? episodeCount : null,
      status: d.attributes.status,
      genres: await that.getGenres(d.relationships.genres.links.related),
      score: score ? 'unknown' : score,
      image: d.attributes.posterImage.original,
      synopsis: d.attributes.synopsis.replace(/(?:\r\n|\r|\n)/g, (matched) => {
        if (/\r\n/.test(matched) && counter % 2 == 0) {
          counter++;
          return '\n';
        }
        counter++;
        return '';
      }),
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
   * @return {Promise<?Manga>}
   */
  static async getManga(manga) {
    const that = new this();
    let data = await request.get(`https://kitsu.io/api/edge/manga?filter[text]=${encodeURIComponent(manga)}`).catch((e) => {
      console.error(e);
      return null;
    });
    if (!data) {
      return null;
    }
    let counter = 0;
    const d = data.body[0];
    const o = {
      title: d.attributes.titles.en_jp,
      chapterCount: d.attributes.chapterCount,
      status: d.attributes.status,
      genres: await that.getGenres(d.relationships.genres.links.related),
      score: Math.round(d.attributes.averageRating),
      image: d.attributes.posterImage.original,
      synopsis: d.attributes.synopsis.replace(/(?:\r\n|\r|\n)/g, (matched) => {
        if (/\r\n/.test(matched) && counter % 2 == 0) {
          counter++;
          return '\n';
        }
        counter++;
        return '';
      }),
    };
    return o;
  }
  /**
   * Get anime genres
   * @param {string} link
   * @return {Promise<Array<string>>}
   */
  async getGenres(link) {
    const d = await request.get(link);
    const j = d.body;
    const genres = [];
    for (const g of j.data) {
      if (!g || !g.attributes.name) {
        return;
      }
      genres.push(g.attributes.name);
    }
    return genres;
  }
}
module.exports = KitsuAPI;
