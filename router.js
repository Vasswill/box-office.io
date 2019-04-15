const   express = require('express'),
        router = express.Router(),
        fs = require('fs-extra'),
        uuidv4 = require('uuidv4'),
        mysql = require('./mysql_config'),
        moment = require('moment');


router.get('/seat', (req,res) => {
    res.render('partials/seatclass');
})

router.post('/seatAdd', (req,res) => {
    var data = req.body;
    var sql = "INSERT INTO `seatclass` (`ClassName(PK)`, `Price`, `Couple`, `FreeFood`, `Width`, `Height`) VALUES ('"+
                data.Name+"','"+ data.Price+"','"+data.Couple+"','"+data.FreeFood+"','"+data.Width+"','"+data.Height+"')";
    mysql.insert(sql);
})

router.all('/', (req, res) => {
    // mysql.connect('CREATE TABLE IF NOT EXISTS tasks (task_id INT AUTO_INCREMENT,title VARCHAR(255) NOT NULL,PRIMARY KEY (task_id));')
    //     .then((resp)=>{
    //         console.log(resp);
    //     })
    //     .catch((err)=>{
    //         console.log(err);
    //     });
    res.render('index');
})
module.exports = router;
