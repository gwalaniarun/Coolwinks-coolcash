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

const app = express();
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
    var sql = "INSERT INTO cooltable (number) VALUES ?";

    var cpyArr = [];
    for (i = 0; i < req.body.number.length; i++) {
        cpyArr[i] = [req.body.number[i]];
    }
    console.log(cpyArr)
    // console.log(cpyArr)

    const tryOne = async () => {

        await cpyArr.forEach(numberArr => {
            console.log(numberArr[0])
            if (numberArr[0] == NaN || numberArr[0].length != 10) {
                cpyArr.splice(cpyArr.indexOf(numberArr), 1);
                console.log('slice1')
            }
            else {
                var sqlget = 'SELECT `number` FROM `cooltable`'
                con.query(sqlget, function (err, result) {
                    result.forEach(element => {
                        if (numberArr[0] == element.number) {
                            cpyArr.splice(cpyArr.indexOf(numberArr), 1);
                            console.log('slice2')
                        }
                    });
                })
            }
        })

        console.log(cpyArr)
        await con.query(sql, [cpyArr], function (err, result) {
            console.log(cpyArr)
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
            if (result.affectedRows >= 1) {
                res.render('download');
            }
            else {
                res.redirect('/coolcash');

            }
        });

    }
    tryOne();

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