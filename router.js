const   express = require('express'),
        router = express.Router(),
        fs = require('fs-extra'),
        uuidv4 = require('uuidv4'),
        mysql = require('./mysql_config'),
        moment = require('moment');
        passport = require('./passport');

router.post('/fetchData',(req,res)=>{
    console.log(req.body);
    var sql = "SElECT * FROM `"+req.body.table+"`";
    mysql.connect(sql)
        .then((resp)=>{
            res.send(resp.rows);
        });
});

router.get('/fetchBranchData', (req,res) => {
    var sql = "SELECT * FROM `branch`";
    mysql.connect(sql)
        .then((resp)=>{
            //console.log(resp);
            res.send(resp.rows);
        });
});

router.get('/fetchSeatClasshData', (req,res) =>{
    var sql = "SELECT * FROM `seatclass`";
    mysql.connect(sql)
        .then((resp)=>{
            //console.log(resp);
            res.send(resp.rows);
        });
});

router.get('/seat', (req,res) => {
    res.render('partials/seatclass');
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

router.post('/Sshift', (req,res) => {
    var data = req.body;
    var sql = "INSERT INTO `shift` (`Day`, `StartTime`, `EndTime`) VALUES ('"+
                data.Date+"','"+ data.starttime+"','"+data.endtime+"')";
    mysql.connect(sql)
        .then((resp)=>{
            console.log(resp);
            res.redirect('/Sshift');
        });
    console.log(sql)
});

router.get('/Sshift', (req,res) => {
    res.render('partials/Sshift');
});

router.post('/theatreAdd', (req,res)=>{
    var data = req.body;
    var sql = "INSERT INTO `theater`(`TheaterCode`, `BranchNo`, `PlanName`) VALUES ";
    data.Theater.forEach((value) => {
        sql += "('"+value.Name+"','"+value.Branch+"','"+data.PlanName+"'),";
    });
    sql = sql.substring(0, sql.length-1);
    console.log(sql);
    // mysql.connect(sql)
    //     .then((resp)=>{
    //         console.log(resp);
    //         res.redirect('/plan');
    //     });
    //console.log(data.Theater[0]);
    
})

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


