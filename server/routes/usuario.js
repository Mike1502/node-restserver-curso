const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

app.get('/usuario', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({}, 'role, nombre').skip(desde).limit(limite).exec((err, usuarios) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Usuario.count({}, (err, cont) => {
            res.json({
                ok: true,
                usuarios,
                cont
            });
        });
    });
});

app.post('/usuario', function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});


// Delete logico 
app.delete('/usuario/:id', async(req, res) => {
    const id = req.params.id;
    const userId = { _id: id }
    const userUpdate = { estado: false }

    try {
        let deleted = await Usuario.findOneAndUpdate(userId, userUpdate, { new: true });

        res.json({
            ok: true,
            usuario: deleted
        });

    } catch (err) {
        return res.status(400).json({
            ok: false,
            err,
            userId,
            userUpdate
        });
    }
});

// Albert
// app.delete('/usuario/:id', async function(req, res) {
//     try {
//         let id = req.params.id;
//         let deleted = await Usuario.findOneAndDelete({ _id: id });

//         res.json({
//             ok: true,
//             usuario: deleted
//         });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// Curso

// app.delete('/usuario/:id', function(req, res) {
//     let id = req.params.id;

//     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         }

//         res.json({
//             ok: true,
//             usuario: usuarioBorrado
//         });

//     });
// });

module.exports = app;