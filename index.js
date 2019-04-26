const express = require('express')
var bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
var mysql = require('mysql');
var vCardsJS = require('vcards-js');

//create a new vCard
var vCard = vCardsJS();

//set properties
vCard.firstName = 'zz';
vCard.lastName = 'cwOffer';
vCard.organization = 'aks';
vCard.title = 'zzCW';

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

var con = mysql.createPool({
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

    if (number !== NaN && number.length==10) {
 
            console.log("Connected!");
            var sql = 'INSERT INTO `cooltable`(`number`) VALUES (' + number + ')';
            con.query(sql, number, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
            res.render('download');

    }
    else{
        res.redirect('/coolcash');
    }
})
app.post('/downloadFun', (req, res) => {
    
     
        //for download contacts from db
        var sqlget = 'SELECT `number` FROM `cooltable`'
        var phno = [];
        con.query(sqlget, function (err, result) {
            if (err) throw err;
            result.forEach(element => {
                phno.push(element.number);
            });
            vCard.cellPhone = phno;
            vCard.saveToFile('./cooloffer.vcf');
            res.sendFile(__dirname + '/cooloffer.vcf');
        });

})

app.get('/download', (req, res) => {
    res.redirect('/coolcash')
})
app.listen(5001, () => {
    console.log('started on port 5001')
})