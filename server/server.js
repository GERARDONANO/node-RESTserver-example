
require('./config/config');
const express = require('express');
const app = express();

 
app.use( express.urlencoded ({ extended : false }) );
app.use( express.json() );

app.get('/usuario', function (req, res) {
  res.json('get usuario');
});


app.post('/usuario', function (req, res) {

    const data = {
        nombre : req.body.nombre,
        edad   : req.body.edad
    }

    const body = req.body;

    if( body.nombre === undefined ){

        res.status( 400 ).json({

            ok : false,
            mensaje: 'El nombre es necesario'
        });
    }else{

        res.json({
            mensaje : ' post usuario ',
            data,
            body
        });

    }


});


app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
  res.json({
    mensaje :'put usuario',
    id
  });
});


app.delete('/usuario', function (req, res) {
  res.json('delete usuario');
});
 
app.listen( process.env.PORT , () => {
    console.log('escuchando el puerto ', process.env.PORT);
});