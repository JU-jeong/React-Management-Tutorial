const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = https://threeheadmonkey.herokuapp.com/api/customers;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});
connection.connect();
connection.on('error', function() {});

const multer = require('multer');
const upload = multer({dest: './upload'})

app.get('/api/customers', (req, res) => {
    connection.query(
        "SELECT * FROM customer WHERE isDeleted = 0",
        (err, rows, fields) => {
            res.send(rows);
            res.send({message: 'hello express!'});
        }
    );
});

app.use('/image', express.static('./upload'));

app.post('/api/customers', upload.single('image'), (req, res) => {
    let sql = 'INSERT INTO customer VALUES (null, ?, ?, ?, ?, ?, now(), 0)';
    let image = '/image/' + req.file.filename;
    let name = req.body.name;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let job = req.body.job;
    let params = [image, name, birthday, gender, job];
    connection.query(sql, params, 
        (err, rows, fields) => {
            res.send(rows);
        }
        
     );
});
//211120 최광식 고객삭제기능구현(미완성)
app.delete('/api/customers/:id', (req, res) => {
    let sql = 'UPDATE customer SET isDeleted = 1 WHERE id = ?';
    let params = [req.params.id];
    connection.query(sql, params, 
        (err, rows, fields) => {
            res.send(rows);
        }
    )
});

app.listen(port, (req, res) => {console.log(`Listening on port ${port}`);
});