const   express = require('express'),
        bodyParser = require('body-parser'),
        ejs = require('ejs'),
        router = require('./router'),
        app = express();

app.set('view engine','ejs');
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', router);

app.listen(process.env.PORT || 9000, () => console.log('server run on port 8080'));
