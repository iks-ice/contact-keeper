const express = require('express');
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
], (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    // User.create({
    //     name: req.body.name,
    //     email: '',
    //     password: '',
    //     date: Date.now()
    // }).then(user => res.json(user));
    res.send(req.body);
});


module.exports = router;