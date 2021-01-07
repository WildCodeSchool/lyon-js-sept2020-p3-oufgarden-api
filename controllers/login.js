const { isAdmin } = require('../models/login.js');
const { verifyPassword, findByEmail } = require('../models/users');
const { SESSION_COOKIE_NAME } = require('../env');

module.exports.handleLogin = async (req, res) => {
  const user = await findByEmail(req.body.email, false);
  if (!user) {
    return res.sendStatus(401);
  }

  // Creation d'un objet pour faire passer l'email de l'input
  // et le password crtypé à la fonction isAdmin
  const attributesForIsAdmin = {
    email: req.body.email,
    password: user.password,
  };

  const checkedPassword = await verifyPassword(user, req.body.password);
  const data = await isAdmin(attributesForIsAdmin);

  if (checkedPassword && data === 'logged' && user) {
    if (req.body.stayConnected) {
      // session cookie will be valid for a week
      req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
    }
    req.session.userId = user.id;
    req.session.save(() => {
      res.status(200).send('logged');
    });
    return null;
  }
  return res.status(401).send('Invalid Credentials');
};
module.exports.handleLogout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).send('Could not destroy session');
    res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
    return res.status(200).send('session deleted');
  });
};
