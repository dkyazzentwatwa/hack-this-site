const { setCommonHeaders, sendJson } = require('../_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  res.setHeader('X-AspNet-Version', '4.0.30319');
  sendJson(res, 200, {
    viewState: '/wEPDwUKLTI0MzI1NzA3NQ9kFgJmD2QWAgIDD2QWAgIBD2QWAgIBD2QWAgIBD2Q=',
    eventValidation: false,
    debug: true
  });
};
