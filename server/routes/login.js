const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

module.exports = app;