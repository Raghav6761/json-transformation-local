console.log('api folder imdex sayms Hemloooo!');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();

const MIME_TYPE_MAP = {
    'application/json' : 'json',
    'text/csv' : 'csv'
}

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid Mime type");
        if (isValid){
            error = null;
        }
        cb(error, "./backend/inputJson");
    },
    filename: (req, file, cb) =>{
        const name = file.originalname+'_converted'+Date.now();
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name+'.'+ext);
    }
});

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

// app.use((res,req,next)=>{
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     // res.setHeader("Access-Control-Allow-Headers", "Origin");
//     next();
// });

app.post('/api/test',multer(storage).single("fila"), (req,res,next)=>{
    console.log('in the post test');
    console.log(req.body);
    console.log('complete request',req);
    const report = [
        {
            id : req.body.id,
            name: req.body.name,
            status: req.body.status
        }
    ];

    res.status(201).json({
        message: 'post req sent',
        report : report
    })
})

app.get('/api/test',(req,res,next)=>{
    console.log('in the link');
    const testStruct = [
        {
            id : '132t4tr',
            name : 'kuch',
        }
    ]

    console.log('before send')
    // res.send.json(testStruct);
    // res.send('returing');

    res.status(200).json({
        message: 'struct Sent!',
        structs : testStruct
    });
})

module.exports = app;