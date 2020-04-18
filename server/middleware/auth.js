const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {

  // console.log('this is our cookies obj', req.cookies);
  if (Object.keys(req.cookies).length === 0) {
    return models.Sessions.create()
      .then((data) => {
        var id = data.insertId;
        return models.Sessions.get({id});
      })
      .then((sessionHash) => {
        console.log('should be a hash?!', sessionHash);
        req.session = { hash: sessionHash.hash };
        res.cookies = { shortlyid: sessionHash.hash };
        console.log('this is the response', res.cookies);
        console.log('this is the request', req.session);
        // return;
        next();
      });
  } else {

  }

};