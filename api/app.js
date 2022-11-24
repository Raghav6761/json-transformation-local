console.log('api folder imdex sayms Hemloooo!');
const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();

const fs = require('fs');
const { parse }= require('csv-parse');
const assert = require('assert');


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

        if (isValid == 'json'){
            cb(error, "./backend/inputJson");
        }
        if (isValid == 'csv'){
            cb(error, "./backend/mapping");
        }
    },
    filename: (req, file, cb) =>{
        const name = file.originalname+'_converted'+Date.now();
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name+'.'+ext);
    }
});

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use("/backend",express.static(path.join("backend")));

// app.use((res,req,next)=>{
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     // res.setHeader("Access-Control-Allow-Headers", "Origin");
//     next();
// });

// app.post('/api/test',multer({storage: storage}).single("fila"), (req,res,next)=>{
app.post('/api/test',multer({storage: storage}).fields([{name: 'source', maxCount: 1},{name: 'mapping', maxCount: 1}]), (req,res,next)=>{
    let records = [];

    const url = req.protocol + '://' + req.get("host");;
    const sourceUrl = url + '/backend/inputJson/' + req.files['source'][0].filename;
    const mappingUrl = url + '/backend/mapping/' + req.files['mapping'][0].filename;
    
    console.log(req.files['mapping'][0]);
    // console.log(sourceUrl, mappingUrl);

    // const readPath = path.join(__dirname, '../', 'backend/mapping/mapping.csv_converted1669294541264.csv');
    const readPath = path.join(__dirname, '../', 'backend/mapping/'+req.files['mapping'][0].filename);
    
    console.log(readPath);
    const parser = parse({columns: true, relax_quotes:true, relax_column_count: true}, function (err, records) {
        console.log('err : ',err);
        this.records = records;
        
        console.log('records have been changed', this.records);
        res.status(201).json({
            // message: 'post req sent',
            // report : report
            message: 'records have been altered',
            output : records
        })    
    });
    fs.createReadStream(readPath).pipe(parser);
    
    // parse(readPath,{trim: true, skip_empty_lines: true, columns: true})
    
    console.log('records go here' , records);

    const report = [
        {
            dirname : readPath,
            sourceUrl : sourceUrl,
            mappingUrl : mappingUrl
        }
    ];
})

app.get('/api/test',(req,res,next)=>{
    console.log('in the link');
    const testStruct = [
        {
            id : '132t4tr',
            name : 'kuch',
        }
    ]

    console.log('before send');

    res.status(200).json({
        message: 'struct Sent!',
        structs : testStruct
    });
})

module.exports = app;