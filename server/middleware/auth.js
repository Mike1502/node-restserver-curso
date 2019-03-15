const jwt = require('jsonwebtoken');

// ============================
//  Verificar Token
// ============================

let verToken = (req, res, next) => {
    try {
        let token = req.get('token');
        let decode = jwt.verify(token, process.env.SEED);
        req.usuario = decode.user;
        next();
    } catch (error) {
        return res.status(400).json({ error });
    }
}

// ============================
//  Verificar Rol de ususario
// ============================


let verRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(400).json({
            error: 'Su usuario no tiene acceso a esta funcion'
        });
    }
}

module.exports = {
    verToken,
    verRole
}