const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Registration = mongoose.model('Registration');
const { check, validationResult } = require('express-validator');


router.get('/', (req, res) => {
    res.render('form', { title: 'Registration form' });
});

router.get('/registrations', (req, res) => {
    Registration.find()
        .then((registrations) => {
            res.render('index', { title: 'Listing registrations', registrations });
        })
        .catch(() => {
            res.send('Sorry! Something went wrong.');});
    });


router.post('/',
    [
        check('name')
            .isLength({ min: 2 })
            .withMessage('Please enter a name'),
        check('email')
            .isLength({ min: 6 })
            .withMessage('Please enter an email'),
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const registration = new Registration(req.body);
            registration.save()
                .then(() => { res.redirect('/registrations'); })
                .catch((err) => {
                    console.log(err);
                    res.send('Sorry! Something went wrong.');
                });
        }
        else {
            res.render('form', {
                title: 'Registration form',
                errors: errors.array(),
                data: req.body,
            });
        }
    
    });

module.exports = router;