const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {

  if (!req.cookies.shortlyid) {
    return models.Sessions.create()
      .then((data) => {
        var id = data.insertId;
        return models.Sessions.get({id});
      })
      .then((sessionHash) => {
        // console.log('should be a hash?!', sessionHash);
        req.session = { hash: sessionHash.hash };
        res.cookies = { shortlyid: sessionHash.hash };
        // console.log('this is the response', res.cookies);
        // console.log('this is the request', req.session);
        // return;
        next();
      });
  } else {
    console.log('this is the else part: ', req);
    // return models.Sessions.get()
  }

};