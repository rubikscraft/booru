//@ts-check

/*
- Utils
  => .resolveSite(site/alias)
  => .jsonfy([images])
  => .shuffle([arr])
  => .randInt(min, max)
*/

const {
  sites, BooruError
} = require('./Constants.js')

// For XML only apis
const xml2js = require('xml2js')
const parser = new xml2js.Parser()

/**
 * Check if `site` is a supported site (and check if it's an alias and return the sites's true name)
 *
 * @private
 * @param  {String} siteToResolve The site to resolveSite
 * @return {String?} Null if site is not supported, the site otherwise
 */
module.exports.resolveSite = function resolveSite(siteToResolve) {
  if (typeof siteToResolve !== 'string') {
    return null
  }

  siteToResolve = siteToResolve.toLowerCase()

  for (let site in sites) {
    if (site === siteToResolve || sites[site].aliases.includes(siteToResolve)) {
      return site
    }
  }

  return null
}

/**
 * Parses xml to json, which can be used with js
 *
 * @private
 * @param  {String} xml The xml to convert to json
 * @return {Promise<Object[]>} A Promise with an array of objects created from the xml
 */
module.exports.jsonfy = function jsonfy(xml) {
  return new Promise((resolve, reject) => {
    // If it's an object, assume it's already jsonfied
    if (typeof xml === 'object') {
      resolve(xml)
    }

    parser.parseString(xml, (err, res) => {
      if (err) reject(err)

      if (res.posts.post !== undefined) {
        resolve(res.posts.post.map(val => val.$))
      } else {
        resolve([])
      }
    })
  })
}


/**
 * Yay fisher-bates
 * <p>Taken from http://stackoverflow.com/a/2450976</p>
 *
 * @private
 * @param  {Array} array Array of something
 * @return {Array}       Shuffled array of something
 */
module.exports.shuffle = function shuffle(array) {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

// Thanks mdn and damnit derpibooru
/**
 * Generate a random int between [min, max]
 *
 * @private
 * @param {Number} min The minimum (inclusive)
 * @param {Number} max The maximum (inclusive)
 */
module.exports.randInt = function randInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Performs some basic search validation
 *
 * @private
 * @param {*} site The site to resolve
 * @param {*} limit The limit for the amount of images to fetch
 */
module.exports.validateSearchParams = (site, limit) => {
  site = module.exports.resolveSite(site)
  limit = parseInt(limit)

  if (site === null)
    throw new BooruError('Site not supported')

  if (typeof limit !== 'number' || Number.isNaN(limit))
    throw new BooruError('`limit` should be an int')

  return {site, limit}
}

/**
 * Finds the matching strings between two arrays
 *
 * @param {String[]} arr1 The first array
 * @param {String[]} arr2 The second array
 * @return {String[]} The shared strings between the arrays
 */
module.exports.compareArrays = (arr1, arr2) => {
  const matches = []
  arr1.forEach(ele1 => {
    arr2.forEach(ele2 => {
      if (ele1.toLowerCase() === ele2.toLowerCase()) {
        matches.push(ele1)
      }
    })
  })

  return matches
}
