const express = require('express')
var bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
var mysql = require('mysql');

const app = express()
app.set('views', './views')

//used for applying css to ejs file
app.use('/public', express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)
app.set('view engine', 'ejs')

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "coolwinks"

});



app.get('/coolcash', (req, res) => {
    res.render('index');
})

app.post('/download', (req, res) => {
    let number = req.body.phno;

    if (number !== NaN) {
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = 'INSERT INTO `cooltable`(`number`) VALUES (' + number + ')';
            con.query(sql, number, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                res.send(number + ' inserted in database.');
            });
        });
    }
})

app.get('/download', (req, res) => {
    res.redirect('/coolcash')
})
app.listen(5001, () => {
    console.log('started on port 5001')
})