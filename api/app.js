console.log('api folder imdex sayms Hemloooo!');
const http = require('http');
const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();

const fs = require('fs');
const { parse }= require('csv-parse');
// const assert = require('assert');


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
    const url = req.protocol + '://' + req.get("host");;
    const sourceUrl = url + '/backend/inputJson/' + req.files['source'][0].filename;
    const mappingUrl = url + '/backend/mapping/' + req.files['mapping'][0].filename;
    
    // const sourceJson = require('../backend/inputJson'+req.files['source'][0].filename);
    // const sourceJson = require('/backend/inputJson'+req.files['source'][0].filename);
    let records = [];
    // console.log('sourceJson ',sourceJson);

    // console.log(sourceUrl, mappingUrl);

    // const readPath = path.join(__dirname, '../', 'backend/mapping/mapping.csv_converted1669294541264.csv');
    const readPath = path.join(__dirname, '../', 'backend/mapping/'+req.files['mapping'][0].filename);
    console.log(readPath);

    const parser = parse({columns: true, relax_quotes:true, relax_column_count: true}, function (err, records) {
        if (err){
            console.log('err : ',err);
            res.status(201).json({
                // message: 'post req sent',
                // report : report
                message: 'records could not be read',
                output : err
            });
        }
        this.records = records;
        
        // console.log('records have been changed', this.records);
        // res.status(201).json({
        //     // message: 'post req sent',
        //     // report : report
        //     message: 'records have been altered',
        //     output : records
        // });
        
        let jsonReq = http.get(sourceUrl, function(response) {
            let data = '',
                json_data;

            response.on('data', function(stream) {
                data += stream;
            });
            response.on('end', function() {
                json_data = JSON.parse(data);

                // output_data = {};
                // let outputArr = [];
                let outputMap = new Map();

                // Code to iterate through the array
                let lenRecord = records.length;
                // let lenLine = records[0].length;
                for (let i = 0;i < lenRecord; i++){
                    console.log('line number',i+1, records[i]);
                    console.log(records[i]['Target']);
                    console.log(records[i][' Source']);
                    console.log(records[i][' Enumeration']);

                    let arr1 = records[i][' Source'].split(" + ");

                    console.log('before for loop', arr1);
                    for (let j = 0; j < arr1.length; j++){
                        arr1[j] = arr1[j].trim();
                        console.log(arr1[j]);
                        if(arr1[j].substring(0,5)=='ENUM('){
                            console.log('it has enum');
                        }else{
                            console.log('not enum');
                            arr2 = arr1[j].split('.');
                            let tempMap = new Map();
                            for(let k=1; k<arr2.length; k++){
                                arr2[k] = arr2[k].trim;
                                console.log('json data at this point',json_data.arr2[k]);
                            }

                        }
                    }

                }
                // Code to iterate through the array - Complete

                // will output a Javascript object
                // console.log(json_data);
                res.status(201).json({
                    message: 'records have been altered',
                    records : records,
                    sourceJson : json_data
                });
            });
        });

        jsonReq.on('error', function(e) {
            console.log(e.message);
        });
    });
    fs.createReadStream(readPath).pipe(parser);

    // const report = [
    //     {
    //         dirname : readPath,
    //         sourceUrl : sourceUrl,
    //         mappingUrl : mappingUrl
    //     }
    // ];
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