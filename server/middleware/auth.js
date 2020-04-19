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
//         req.session = { hash: sessionHash.hash };
//         res.cookies = { shortlyid: sessionHash.hash };
//         next();
//       });
//   }

//   if (req.cookies.shortlyid) {

//     var hash = req.cookies.shortlyid;
//     models.Sessions.get({hash})

//       .then((session) => {
//         if (!session) {
//           throw session;
//         } else {
//           console.log('SESSSSSSION', session);
//           //console.log('COOKIIIIEEE', res.cookies);
//           return session;
//         }
//         // var hash = req.cookies.shortlyid;
//         // res.cookies = { shortlyid: session.hash };
//       })
//       .then((session) => {
//         req.session = session;
//         //console.log('session: ', req);
//         next();
//       })
//       .catch((err) => {
//         next(err);
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

// HELPER FUNCTION

module.exports.verifySession = (req, res, next) => {
  if (!models.Sessions.isLoggedIn(req.session)) {
    res.redirect('/login');
  } else {
    next();
  }
};