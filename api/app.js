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

                    var key = records[i]['Target'].trim();

                    var arr1 = records[i][' Source'].split(" + ");

                    // console.log('before for loop', arr1);

                    let outStr = '';
                    for (let j = 0; j < arr1.length; j++){
                        arr1[j] = arr1[j].trim();
                        console.log(arr1[j]);
                        var outInner = '';
                        if(arr1[j].substring(0,5)=='ENUM('){
                            // console.log('it has enum');
                            let enumeration = records[i][' Enumeration'];
                            // outInner = ' ENUMSTH ';
                            // console.log('length of arr1[j] is ::::::::::::::', arr1[j].length);
                            let toCheck = arr1[j].substring(6,arr1[j].length-1);
                            // console.log('::::::::', enumeration);
                            let enumArr = enumeration.split(';');
                            console.log(enumArr,' ::::: dfgh');
                            let compareWith = json_data[toCheck];
                            enumArr.forEach(element => {
                                kv = element.split(":");
                                let sliced = kv[0].slice(1,kv[0].length-1);
                                console.log(sliced,compareWith);
                                if(sliced===compareWith){
                                    console.log('in the if block');
                                    // outInner = kv[1].slice(1,kv[0].length-1);
                                    outInner = kv[1];
                                }else{
                                    console.log('in the else block');
                                }
                            });
                        }
                        // else if(arr1[j].includes('IF(')){
                        //     // console.log('has IF');
                        //     outInner = ' IF ';
                        // }
                        else
                        {
                            // console.log('not enum');
                            var arr2 = arr1[j].split('.');
                            var arr2len = arr2.length;
                            console.log(arr2);
                            // let tempMap = new Map();
                            // console.log('confirming before starting the loop',json_data.id);
                            
                            // console.log('json data ------',json_data[arr2[1]]);
                            // console.log(arr2.length);
                            if(typeof(json_data[arr2[1]]) === 'undefined'){
                                // console.log('in if blocks', 'value of arr2[0]', arr2[0]);
                            // if(arr2len > 1){
                                var temparr = arr2[0];
                            }
                            else{
                                var temparr = json_data[arr2[1]];
                            }
                            // console.log('temp arr over here is ',temparr);
                            // let temparr = tempIn;
                            for(let k=2; k < arr2len; k++){
                                // if(k==arr2len-1){

                                // }
                                arr2[k] = arr2[k];
                                // console.log('json would be checked for this ::',arr2[k]);
                                // console.log('json data at this point',temparr);
                                // outInner+=json_data[arr2[k]]+" ";
                                temparr = temparr[arr2[k]]
                                if(typeof(temparr)=="string"){
                                    // outInner+=temparr
                                    break;
                                }
                            }
                            outInner+=temparr
                            // let k = 1;
                            // let temparr;
                            // console.log('address details', json_data['address']['street']);
                        }
                        outStr+=outInner + ' ';
                        // console.log();
                    }
                    outputMap.set(key, outStr);
                    // console.log('The outmap :::::: ',outputMap)
                }
                console.log('output map is here !!!! :::: ',outputMap);
                // Code to iterate through the array - Complete

                // covert the map to json
                const jsonOut = Object.fromEntries(outputMap);

                // will output a Javascript object
                // console.log(json_data);
                res.status(201).json({
                    // message: 'here is the target output',
                    // records : records,
                    // sourceJson : json_data,
                    // output : jsonOut
                    jsonOut
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