var express = require('express');
var router = express.Router();

let userModel = require('../schemas/users');

router.get('/', async function (req, res) {
    let result = await userModel.find({
        isDeleted: false
    }).populate({
        path: 'role',
        select: "name"
    });
    res.send(result);
});

router.get('/:id', async function (req, res) {
    try {
        let id = req.params.id;
        let result = await userModel.findById(id)
            .populate('role', 'name');
        if (!result || result.isDeleted) {
            res.status(404).send({
                message: "ID NOT FOUND"
            });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(404).send({
            message: "ID NOT FOUND"
        });
    }
});

router.post('/', async function (req, res) {
    let newUser = new userModel({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        role: req.body.role
    });
    await newUser.save();
    res.send(newUser);
});

router.put('/:id', async function (req, res) {
    try {
        let id = req.params.id;
        let result = await userModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        res.send(result);
    } catch (error) {
        res.status(404).send(error);
    }
});

router.delete('/:id', async function (req, res) {
    try {
        let id = req.params.id;
        let result = await userModel.findById(id);
        if (!result || result.isDeleted) {
            res.status(404).send({
                message: "ID NOT FOUND"
            });
        } else {
            result.isDeleted = true;
            await result.save();
            res.send(result);
        }
    } catch (error) {
        res.status(404).send({
            message: "ID NOT FOUND"
        });
    }
});

router.post('/enable', async function (req, res) {
    let result = await userModel.findOne({
        username: req.body.username,
        email: req.body.email,
        isDeleted: false
    });
    if (!result) {
        res.status(404).send({
            message: "USER NOT FOUND"
        });
    } else {
        result.status = true;
        await result.save();
        res.send(result);
    }
});

router.post('/disable', async function (req, res) {
    let result = await userModel.findOne({
        username: req.body.username,
        email: req.body.email,
        isDeleted: false
    });

    if (!result) {
        res.status(404).send({
            message: "USER NOT FOUND"
        });
    } else {
        result.status = false;
        await result.save();
        res.send(result);
    }
});

module.exports = router;