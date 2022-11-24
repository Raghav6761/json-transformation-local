console.log('api folder imdex sayms Hemloooo!');
const express = require('express');

const app = express();

// app.use((res,req,next)=>{
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     // res.setHeader("Access-Control-Allow-Headers", "Origin");
//     next();
// });

app.post('/api/test', (req,res,next)=>{
    console.log('in the post test');
    console.log(req.body);
    const report = [
        {
            id : req.body.id,
            name: req.body.name,
            status: req.body.status
        }
    ];

    res.status(200).json({
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