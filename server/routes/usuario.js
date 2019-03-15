const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verToken, verRole } = require('../middleware/auth');

app.get('/usuario', verToken, async(req, res) => {

    return res.status(200).json({
        usuario: req.usuario,
        nombre: req.usuario.nombre
    });

    try {
        let users = await Usuario.find();

        res.status(200).json({
            Usuarios: users
        });
    } catch (error) {
        return res.status(400).json({ error });
    }
});

app.get('/usuario/:id', verToken, async(req, res) => {
    try {
        let id = req.params.id;
        const userId = { _id: id }
        let user = await Usuario.findOne(userId);

        res.status(200).json({
            Usuario: user
        });
    } catch (error) {
        return res.status(400).json({ error });
    }
});

app.post('/usuario', [verToken, verRole], async(req, res) => {
    try {
        let body = req.body;
        const newUser = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role
        });

        let userAdded = await newUser.save();

        res.status(200).json({
            UsuarioNuevo: userAdded
        });
    } catch (error) {
        return res.status(400).json({ error });
    }

});

app.patch('/usuario/:id', [verToken, verRole], async(req, res) => {
    try {
        let id = req.params.id;
        const userId = { _id: id }
        const body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

        let userUpdated = await Usuario.findOneAndUpdate(userId, body, { new: true, runValidator: true });

        res.status(200).json({
            UsuarioActualizado: userUpdated
        });
    } catch (error) {
        return res.status(400).json({ error });
    }
});

app.delete('/usuario/:id', [verToken, verRole], async(req, res) => {
    try {
        const id = req.params.id;
        const userId = { _id: id }
        const userUpdate = { estado: false }

        let userDeleted = await Usuario.findOneAndUpdate(userId, userUpdate, { new: true });

        res.status(200).json({
            UsuarioEliminado: userDeleted
        });

    } catch (error) {
        return res.status(400).json({ error });
    }
});

module.exports = app;