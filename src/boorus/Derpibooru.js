//@ts-check
const Booru = require('./Booru.js')
const Utils = require('../Utils.js')
const Constants = require('../Constants.js')
const Post = require('../structures/Post.js')
const Snekfetch = require('snekfetch')

/**
 * A class designed for Derpibooru
 * >:(
 * @private
 * @extends Booru
 * @inheritDoc
 */
class Derpibooru extends Booru {
  /**
   * Create a new booru for Derpibooru from a site
   * @param {Site} site The site to use
   * @param {Object?} credentials Credentials for the API (Currently not used)
   */
  constructor(site, credentials) {
    super(site, credentials)
  }

  /** @inheritDoc */
  search(tags, {limit = 1, random = false, credentials = false} = {}) {
    if(!credentials && this.credentials) credentials = this.credentials;

    if (!Array.isArray(tags)) {
      tags = [tags]
    }

    // For any image, you must supply *
    if (tags[0] === undefined) {
      tags[0] = '*'
    }

    // Includes random limit for derpi
    // http://example.com/posts/?tags=some_example&limit=100&sf=random%AB43FF
    // Sorry, but derpibooru has an odd and confusing api that's not similar to the others at all
    const uri = Constants.searchURI(this.domain, this.site, tags, limit) + (random ?
      `&${this.site.random}`
      //+ `${(this.site.random.endsWith('%'))?Array(7).fill(0).map(v=>Utils.randInt(0,16)).join(''):''}`
      : '') + (credentials ? "&key=" + credentials : "")

    //console.log(uri)

    const options = Constants.defaultOptions

    return new Promise((resolve, reject) => {
      Snekfetch.get(uri, options)
        .then(result => {
          resolve((result.body.search).slice(0, limit).map(v => new Post(v, this)))
        })
        .catch(e => {e.name = 'BooruError'; reject(e)})
    })
  }
}
module.exports = Derpibooru
