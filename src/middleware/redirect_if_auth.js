const redirect_if_auth = (req, res, next, path="/") => {
  // redireciona o usuario pra um local se ele estiver logado

  if (req.session.id && req.session.token){
    res.redirect(303, path);
    return res.send();
  }
  return next();
}

module.exports = redirect_if_auth;