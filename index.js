const express = require('express')
var bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

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

app.get('/', (req, res) => {
    res.render('index');
})

app.listen(5001, () => {
    console.log('started on port 5001')
})