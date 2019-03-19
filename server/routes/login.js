const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const Usuario = require('../models/usuario');

app.post('/login', async(req, res) => {
    try {
        let body = req.body;
        let loguser = await Usuario.findOne({ email: body.email });

        if (!loguser) {
            throw "No Existe Usuario";
        }

        if (!bcrypt.compareSync(body.password, loguser.password)) {
            throw "Contraseña Incorrecta";
        }

        let token = jwt.sign({
            user: loguser
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.status(200).json({
            usuario: loguser,
            token: token
        })
    } catch (error) {
        return res.status(400).json({ error });
    }
});

//
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {
    try {
        let token = req.body.idtoken;
        let googleUser = await verify(token);
        let newUser = await Usuario.findOne({ email: googleUser.email });
        if (newUser) {
            if (newUser.google === false) {
                return res.status(400).json({ err: 'Este usuario ya existe' });
            } else {
                let token = jwt.sign({
                    user: newUser
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.status(200).json({
                    user: newUser,
                    token
                });
            }
        } else {
            let user = new Usuario();
            user.nombre = googleUser.nombre;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            let userAdded = await user.save();

            res.status(200).json({
                UsuarioNuevo: userAdded
            });
        }
    } catch (error) {
        return res.status(400).json({ error });
    }

});

module.exports = app;