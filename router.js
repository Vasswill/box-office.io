const   express = require('express'),
        router = express.Router(),
        fs = require('fs-extra'),
        uuidv4 = require('uuidv4'),
        mysql = require('./mysql_config'),
        moment = require('moment');
        passport = require('./passport');

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else{
        res.redirect("/");
    }
}

router.all('/', (req, res) => {
    console.log(req.user);
    if(!req.isAuthenticated()){
        res.render('index', {
            auth: false
        });
    }else{
        res.render('index', {
            auth: true
        });
    }
});

router.get('/userdata', checkAuthentication, (req,res)=>{
    console.log('/userdata<--',req.query);
    if(Object.keys(req.query).length==0){
        res.send(req.user);
    }else{
        let columns = '`'+req.query.columns.join().replace(',','`,`')+'`';
        let table = req.user.customerNo == null ? 'staff' : 'customer';
        let searchField = req.user.customerNo == null ? 'StaffNo' : 'CustomerNo';
        let userNo = req.user.customerNo == null ? req.user.staffNo : req.user.customerNo;
        mysql.connect('SELECT '+columns+' FROM `'+table+'` WHERE `'+searchField+'`='+userNo+';')
        .then((resp)=>{
            if(resp.rows.length <= 0){
                //return
                res.sendStatus(404);
            }
            res.send({...req.user,...resp.rows[0]});
        })
        .catch((err)=>{
            console.log('error',err);
        });
    }
});

router.get('/admin', checkAuthentication, (req,res) => {
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
router.get('/logout', checkAuthentication, (req,res)=>{
    req.logout();
    res.redirect('/')
})

module.exports = router;
