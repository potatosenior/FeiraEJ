const jwt = require("jsonwebtoken");
const User = require("../models/Cliente");

const auth = async (req, res, next) => {
  // Verifica se o usuário está logado, se nao estiver, retorna um erro
  try {
    const token = req.session.token;
    // obj do cookie descriptografado
    const cookie_descripted = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({_id: cookie_descripted._id, "tokens.token": token});

    if (!user) {
      throw new Error;
    } else
      return next();
  } catch (error) {
    return res.render('erro', {
      code: 401,
      message: "Acesso não autorizado! Por favor, faça login!",
      button_text: "Fazer login",
      button_url: "/login",
      logged: req.session.isLogedIn
    });
    // return res.send();

    // res.status(401).send({error: "Por favor, faça login!"});
  }
}

module.exports = auth;