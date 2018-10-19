const fetch = require('node-fetch');
/* eslint-disable require-jsdoc */
class KitsuAPI {
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
 * @param {?number|?function} offset
 * @return {Promise<?Anime>}
 */
  static async getAnime(anime, offset = 0) {
    try {
      let d = await fetch(`https://kitsu.io/api/edge/manga?filter[text]=${encodeURIComponent(anime)}`)
        .then((res) => res.json());
      if (!d) {
        return null;
      }
      if (typeof offset === 'function') {
        offset = offset(d.data);
        if (offset instanceof Promise) offset = await offset;
        if (!Number.isInteger(offset)) {
          throw new TypeError(
            'Offset function must return a Number!'
          );
        }
      }
      d = d.data[offset && offset < d.data.length ? offset : 0];
      const episodeCount = d.attributes.episodeCount;
      let counter = 0;
      let score = Math.round(d.attributes.averageRating);
      const o = {
        title: d.attributes.titles.en_jp,
        episodeCount: episodeCount ? episodeCount : null,
        status: d.attributes.status,
        genres: await this.getGenres(d.relationships.genres.links.related),
        score: score ? 'unknown' : score,
        image: d.attributes.posterImage.original,
        synopsis: d.attributes.synopsis.replace(/(?:\r\n|\r|\n)/g, (br) => {
          if (/\r\n/.test(br) && counter % 2 === 0) {
            counter++;
            return '\n';
          }
          counter++;
          return '';
        }),
      };
      return o;
    } catch (err) {
      console.error(err);
      return null;
    }
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
   * @param {?number|?function} offset
   * @return {Promise<?Manga>}
   */
  static async getManga(manga, offset = 0) {
    try {
      let d = await fetch(`https://kitsu.io/api/edge/manga?filter[text]=${encodeURIComponent(manga)}`)
        .then((res) => res.json());
      if (!d) {
        return null;
      }
      let counter = 0;
      if (typeof offset === 'function') {
        offset = offset(d.data);
        if (offset instanceof Promise) offset = await offset;
        if (!Number.isInteger(offset)) {
          throw new TypeError(
            'Offset function must return a Number!'
          );
        }
      }
      d = d.data[offset && offset < d.data.length ? offset : 0];
      const o = {
        title: d.attributes.titles.en_jp,
        chapterCount: d.attributes.chapterCount,
        status: d.attributes.status,
        genres: await this.getGenres(d.relationships.genres.links.related),
        score: Math.round(d.attributes.averageRating),
        image: d.attributes.posterImage.original,
        synopsis: d.attributes.synopsis.replace(/(?:\r\n|\r|\n)/g, (br) => {
          if (/\r\n/.test(br) && counter % 2 === 0) {
            counter++;
            return '\n';
          }
          counter++;
          return '';
        }),
      };
      return o;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  /**
   * Get anime genres
   * @param {string} link
   * @return {Promise<Array<string>>}
   */
  static async getGenres(link) {
    const d = await fetch(link).then((res) => res.json());
    const genres = [];
    for (const g of d.data) {
      if (!g || !g.attributes.name) {
        return;
      }
      genres.push(g.attributes.name);
    }
    return genres;
  }
  /**
   * Get a random number
   * @param {number} max
   * @return {number} random number
   */
  static random(max) {
    return Math.floor(Math.random() * max);
  }
}
module.exports = KitsuAPI;
