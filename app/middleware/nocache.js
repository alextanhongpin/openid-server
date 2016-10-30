/*
 * Enable this at the route you want to turn caching off
 * For security reasons, we do not want certain pages in our application
 * to be cached
**/

module.exports = function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate'); // HTTP 1.1
  res.header('Expires', '-1'); // Proxies
  res.header('Pragma', 'no-cache'); // HTTP 1.0
  return next();
}