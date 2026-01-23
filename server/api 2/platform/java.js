const { setCommonHeaders, sendJson } = require('../_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  sendJson(res, 200, {
    actuator: ['/actuator/env', '/actuator/heapdump'],
    log4j: '2.14.1'
  });
};
