const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const { verificaTokenImg } = require('../middlewares/autenticacion');

app.get('/imagen/:tipo/:img', verificaTokenImg ,( req, res ) => {

    const tipo = req.params.tipo;
    const img = req.params.img;

    const pathImg = path.resolve( __dirname,`../../uploads/${ tipo }/${ img }`);
    console.log(fs.existsSync( pathImg ), pathImg );
    if( fs.existsSync( pathImg ) ){

        res.sendFile( pathImg );

    }else{

        const noImagePath = path.resolve( __dirname,'../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }



});







module.exports = app;