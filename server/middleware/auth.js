const models = require('../models');
const Promise = require('bluebird');

// module.exports.createSession = (req, res, next) => {

//   if (!req.cookies.shortlyid) {
//     return models.Sessions.create()
//       .then((data) => {
//         var id = data.insertId;
//         return models.Sessions.get({id});
//       })
//       .then((sessionHash) => {
//         // console.log('should be a hash?!', sessionHash);
//         req.session = { hash: sessionHash.hash };
//         res.cookies = { shortlyid: sessionHash.hash };
//         // console.log('this is the response', res.cookies);
//         // console.log('this is the request', req.session);
//         // return;
//         next();
//       });
//   }

//   if (req.cookies.shortlyid) {
//     // console.log('this is the else part: ', req);
//     // our request object has a prop called
//     // cookies : { shortlyid : 'asdasdsadadsadd'}
//     // return models.Sessions.get()
//     //set alias to request hash
//     var hash = req.cookies.shortlyid;
//     models.Sessions.get({hash})
//       .then((data) => {
//         console.log(data);
//         if (data.userId) {
//           return models.Sessions.create();
//         }
//       })
//       .then((results) => {
//         // console.log('LOOKS GOOD', sessionObj);
//         // console.log('new session object', req);
//         return models.Sessions.get({id: results.insertId});
//       })
//       .then((session) => {
//         res.cookies = { shortlyid: session.hash };
//         console.log('cookies', res.cookies);
//         return session;
//       })
//       .then((session) => {
//         req.session = session;
//         console.log('session: ', req);
//       });
//   }
// };

module.exports.createSession = (req, res, next) => {

  Promise.resolve(req.cookies.shortlyid)
    .then(hash => {
      if (!hash) {
        throw hash;
      }
      return models.Sessions.get({ hash });
    })
    .tap(session => {
      if (!session) {
        throw session;
      }
    })
    // initializes a new session
    .catch(() => {
      return models.Sessions.create()
        .then(results => {
          return models.Sessions.get({ id: results.insertId });
        })
        .tap(session => {
          res.cookie('shortlyid', session.hash);
        });
    })
    .then(session => {
      req.session = session;
      next();
    });
};