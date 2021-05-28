// A bit excessive being extracted in own file but let's keep things easy to ead
// Also no error handling
module.exports = function (unixDate) {
  return new Date(unixDate * 1000)
}
