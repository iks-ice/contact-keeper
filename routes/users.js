const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const User = require('../models/User');

//@route    POST api/users
//@desc     Register a user
//@access   Public

router.post('/', [
    //check name
    check('name', 'Name is required').notEmpty({ignore_whitespace: true}),
    check('email', 'Valid e-mail is required').isEmail(),
    check('password', 'Password should consist of 4 or more characters').isLength({min: 4})
], async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    const {name, password, email} = req.body;

    try {
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({msg: 'User already exists'})
        }

        user = new User({name, password, email});

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 360000
        },
            (err, token) => {
                if (err) throw err;
                res.json({token});
            })

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;