const   express = require('express'),
        router = express.Router(),
        fs = require('fs-extra'),
        uuidv4 = require('uuidv4'),
        mysql = require('./mysql_config'),
        moment = require('moment');
        passport = require('./passport');

router.all('/', (req, res) => {
    // mysql.connect('SELECT * FROM users WHERE username="testuser2";')
    // .then((resp)=>{
    //     console.log(resp);
    // })
    // .catch((err)=>{
    //     console.log('error',err);
    // });
    console.log(req.user);
    res.render('index');
});

router.get('/admin', (req,res) => {
    res.render('admin');
});

router.post('/login', 
    passport.authenticate('local', { 
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true 
    }), (req,res) => {
    console.log('login route run!', req.body);
});

module.exports = router;
