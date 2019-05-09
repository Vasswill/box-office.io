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
        res.redirect("/guest");
    }
}

router.all('/', checkAuthentication, (req, res) => {
    res.render('index', {
            auth: req.user.customerNo != null ? 1 : 2
    });
});

router.all('/guest', (req,res)=>{
    res.render('index', {
        auth: false
    });
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

router.post('/fetchData',(req,res)=>{
    console.log(req.body);
    var sql = "SElECT * FROM `"+req.body.table+"`";
    mysql.connect(sql)
        .then((resp)=>{
            res.send(resp.rows);
        });
});


router.get('/seat', (req,res) => {
    res.render('partials/seatclass');
});

router.get('/branch', (req,res) => {
    res.render('partials/branch');
});

router.get('/schedule', (req,res) => {
    res.render('partials/schedule');
});
router.post('/seatAdd', (req,res) => {
    var data = req.body;
    var sql = "INSERT INTO `seatclass` (`ClassName`, `Price`, `Couple`, `FreeFood`, `Width`, `Height`) VALUES ('"+
                data.Name+"','"+ data.Price+"','"+data.Couple+"','"+data.FreeFood+"','"+data.Width/100+"','"+data.Height/100+"')";
    mysql.connect(sql)
        .then((resp)=>{
            console.log(resp);
            res.redirect('/seat');
        });
});

router.get('/plan', (req,res)=>{
    res.render('partials/plan');
});

router.post('/planAdd', (req,res)=>{
    var data = req.body;
    console.log(data);
    var sql = "INSERT INTO `plan` (`PlanName`, `PlanHeight`, `PlanWidth`, `SeatClass1`, `NumberRol1`, `SeatClass2`, `NumberRol2`, `SeatClass3`, `NumberRol3`, `SeatClass4`, `NumberRol4`) VALUES ('"+
                data.PlanName+"','"+ data.PlanHeight+"','"+data.PlanWidth+"','"+data.SeatClass1+"','"+data.NoRow1+"','"+data.SeatClass2+"','"+data.NoRow2+"','"+data.SeatClass3+"','"+data.NoRow3+"','"+data.SeatClass4+"','"+data.NoRow4+"')";
    sql = sql.replace(/'undefined'/g, 'NULL');
    console.log(sql);
    mysql.connect(sql)
        .then((resp)=>{
            console.log(resp);
            var sql = "INSERT INTO `theater`(`TheaterCode`, `BranchNo`, `PlanName`) VALUES ";
            data.Theater.forEach((value) => {
                sql += "('"+value.Name+"','"+value.Branch+"','"+data.PlanName+"'),";
            });
            sql = sql.substring(0, sql.length-1);
            mysql.connect(sql)
                .then((resp)=>{
                    console.log(resp);
                    res.redirect('/plan');
                });
            
       });
    
});

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

router.post('/branch', (req,res) => {
    var data = req.body;
    var sql = "INSERT INTO `branch` (`BranchName`, `BranchAddress`, `PhoneNumber`, `ManagerStaffNo`) VALUES ('"+
                data.Name+"','"+ data.Address+"','"+data.Phone+"','"+data.Manager+"')";
    mysql.connect(sql)
        .then((resp)=>{
            console.log(resp);
            res.redirect('/branch');
        });
    console.log(sql)
});

router.post('/schedule', (req,res) => {
    var data = req.body;
    var sql = "INSERT INTO `schedule` (`MovieNo`, `TheatherCode`, `Date`, `Time`,`Audio`,`Dimension`,`Subtitle`) VALUES ('"+
                data.movie+"','"+data.theater+"','"+data.Date+"','"+data.StartTime+"','"+data.Audio+"','"+data.Subtitle+"','"+data.AdDuration+"')";
    console.log(sql)
    // mysql.connect(sql)
    //     .then((resp)=>{
    //         console.log(resp);
    //         res.redirect('/schedule');
    //     });
    // console.log(sql)
});
module.exports = router;
