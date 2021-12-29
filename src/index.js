var express = require('express'),
    app = express(),
    cors = require('cors'),
    morgan = require('morgan'),
    routes = require('./Routes/routes');

require('./Database/mysql');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(morgan('dev'));

app.use('/api-ninieras',routes);

var port = process.env.PORT || 3005;

app.listen(port,(err) => 
    {
        if (err) throw err;
        console.log('conectado al puerto ',port)
    }
);