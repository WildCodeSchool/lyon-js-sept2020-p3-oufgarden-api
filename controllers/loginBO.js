const { isAdmin } = require('../models/loginBO.js');
const { verifyPassword, findByEmail } = require('../models/users');

module.exports.handleLogin = async (req, res) => {
  const user = await findByEmail(req.body.email, false);

  // Creation d'un objet pour faire passer l'email de l'input
  // et le password crtypé à la fonction isAdmin
  const attributesForIsAdmin = {
    email: req.body.email,
    password: user.password,
  };
  const checkedPassword = await verifyPassword(user, req.body.password);
  const data = await isAdmin(attributesForIsAdmin);

  if (checkedPassword && data === 'logged' && user) {
    req.session.userId = user.id;
    console.log(req.session);
    req.session.save((err) => {
      if (err) return res.sendStatus(403);
      return res.status(200).send('logged');
    });
  }
};
