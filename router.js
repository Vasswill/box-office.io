const   express = require('express'),
        router = express.Router(),
        fs = require('fs-extra'),
        uuidv4 = require('uuidv4'),
        mysql = require('./mysql_config'),
        moment = require('moment');
        passport = require('./passport');

router.get('/fetchData/:table/:condition', (req,res) => {
    var sql = "SELECT * FROM `"+req.params.table+"` ",
        condition = req.params.condition.split("-");
    if(condition[0]!="none"){
        sql += "WHERE `"+condition[0]+"` = '"+condition[1]+"'";
    }
    //console.log(sql);
    mysql.connect(sql)
        .then((resp)=>{
            //console.log(resp);
            res.send(resp.rows);
        });
});

router.get('/seat', (req,res) => {
    res.render('partials/seatclass');
});

router.post('/seat', (req,res) => {
    var data = req.body;
    var sql = "INSERT INTO `seatclass` (`ClassName`, `Price`, `Couple`, `FreeFood`, `Width`, `Height`) VALUES ('"+
                data.Name+"','"+ data.Price+"','"+data.Couple+"','"+data.FreeFood+"','"+data.Width/100+"','"+data.Height/100+"')";
    mysql.connect(sql)
        .then((resp)=>{
            console.log(resp);
            res.redirect('/seat');
        });
});

// router.get('/plan', (req,res)=>{
//     res.render('partials/plan');
// });

router.post('/plan', (req,res)=>{
    var data = req.body;
    console.log(data);
    var sql = "INSERT INTO `plan` (`PlanName`, `PlanHeight`, `PlanWidth`, `SeatClass1`, `NumberRow1`, `SeatClass2`, `NumberRow2`, `SeatClass3`, `NumberRow3`, `SeatClass4`, `NumberRow4`) VALUES ('"+
                data.PlanName+"','"+ data.PlanHeight+"','"+data.PlanWidth+"','"+data.SeatClass1+"','"+data.NoRow1+"','"+data.SeatClass2+"','"+data.NoRow2+"','"+data.SeatClass3+"','"+data.NoRow3+"','"+data.SeatClass4+"','"+data.NoRow4+"')ON DUPLICATE KEY UPDATE PlanName=VALUES(PlanName),PlanName=VALUES(PlanName),PlanHeight=VALUES(PlanHeight),PlanWidth=VALUES(PlanWidth),SeatClass1=VALUES(SeatClass1),NumberRow1=VALUES(NumberRow1),SeatClass2=VALUES(SeatClass2),NumberRow2=VALUES(NumberRow2),SeatClass3=VALUES(SeatClass3),NumberRow3=VALUES(NumberRow3),SeatClass4=VALUES(SeatClass4),NumberRow4=VALUES(NumberRow4)";
    sql = sql.replace(/'undefined'/g, 'NULL');
    console.log(sql);
    mysql.connect(sql)
        .then((resp)=>{
            var TheatreDelete = [];
            console.log(resp);
            if(data.Theatre != null){
                var sqlInsert = "INSERT INTO `theatre`(`TheatreCode`, `BranchNo`, `PlanName`) VALUES ",
                sqlDelete = "DELETE FROM `theatre` WHERE `TheatreCode` IN (?)",
                callFunctionSql = [0,0]; //Insert and Update , Delete
                data.Theatre.forEach((value) => {
                    switch(value.Detail.Type){
                        case 'Update' : if(value.Detail.Old != value.Name){ TheatreDelete.push(value.Detail.Old); callFunctionSql[1]=1; } 
                        case 'Create' : sqlInsert += "('"+value.Name+"','"+value.Branch+"','"+data.PlanName+"'),"; callFunctionSql[0]=1; break;
                        case 'Delete' : TheatreDelete.push(value.Detail.Old); callFunctionSql[1]=1; break;
                    }
                });
                sqlInsert = sqlInsert.substring(0, sqlInsert.length-1);
                sqlInsert += "ON DUPLICATE KEY UPDATE TheatreCode=VALUES(TheatreCode), BranchNo=VALUES(BranchNo), PlanName=VALUES(PlanName)";
                callFunctionSql[1] ? sql = sqlDelete : sql = sqlInsert;
                if(callFunctionSql[0]||callFunctionSql[1]){
                    console.log(sql);
                    mysql.connect(sql,TheatreDelete)
                        .then((resp)=>{
                            if(callFunctionSql[0]){
                                sql = sqlInsert;
                                mysql.connect(sql).then((resp)=>{
                                    console.log(resp);
                                    res.send(resp);
                                });
                            }
                            else{
                                console.log(resp);
                                res.send(resp.rows);
                            }
                        });
                }
                else res.send(resp);
            }else res.send(resp);
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
