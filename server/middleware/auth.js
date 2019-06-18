const { User } = require('./../models/user');

let auth = (req, res, next) => {
  //bring in the request cookies
  const token = req.cookies.auth;

  // able to access the user and its methods because we import it
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.status(401).send('no access');

    //add a value to request that calls token which contains the token
    req.token = token;
    //call next to run the callback from the original function
    next();
  });
};

module.exports = { auth };
