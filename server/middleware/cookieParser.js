const parseCookies = (req, res, next) => {

  if(!req.headers.cookie){
    req.cookies = {};
    next();
    return;
  }

  var cookieObj = {};

  var cookies = req.headers.cookie.split('; ');
  cookies.forEach((cookie) => {
    var cookieArray = cookie.split('=');
    cookieObj[cookieArray[0]] = cookieArray[1];
  });

  req.cookies = cookieObj;
  next();
};


module.exports = parseCookies;