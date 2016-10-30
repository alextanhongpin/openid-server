/*
 * url.js
 *
 * Description: Construct the full URL of the request
**/
const url = require('url');

function fullUrl(req) {

  return url.format({
    protocol: req.protocol,
    hostname: req.hostname,
    pathname: req.originalUrl
  });
}

module.exports = fullUrl;