module.exports = function getNoradIdsFromLaunch(launch) {
  const noradIds = [];
  launch.rocket.payloads.forEach(payload => {
    payload.norad_id.forEach(id => noradIds.push(id))
  })

  return noradIds;
}
