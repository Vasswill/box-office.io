const   express = require('express'),
        router = express.Router(),
        fs = require('fs-extra'),
        uuidv4 = require('uuidv4'),
        mysql = require('./mysql_config'),
        moment = require('moment');

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
